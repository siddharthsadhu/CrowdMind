from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import httpx
import json
import os
import uuid

from app.core.database import get_db
from app.core.dependencies import require_auth, get_optional_user, require_current_user
from app.models.user import User
from app.core.uuid_utils import parse_uuid
from app.core.config import settings
from app.repositories.questions import QuestionRepository
from app.services.questions import QuestionService
from app.schemas.questions import QuestionCreate, QuestionUpdate, QuestionResponse, QuestionListResponse
from app.models.faq import PublishedFaq
from app.models.discussion import Discussion
from app.models.question import Question

router = APIRouter(prefix="/api/v1/questions", tags=["questions"])


def get_service(db: AsyncSession = Depends(get_db)) -> QuestionService:
    return QuestionService(QuestionRepository(db))


@router.post("", response_model=QuestionResponse, status_code=201)
async def create_question(
    data: QuestionCreate,
    user_id: str = Depends(require_auth),
    service: QuestionService = Depends(get_service),
):
    return await service.create(user_id, data)


@router.get("", response_model=QuestionListResponse)
async def list_questions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: str | None = None,
    status: str | None = None,
    service: QuestionService = Depends(get_service),
):
    return await service.list(page=page, page_size=page_size, category_id=category_id, status=status)


@router.get("/{question_id}", response_model=QuestionResponse)
async def get_question(
    question_id: str,
    service: QuestionService = Depends(get_service),
):
    parse_uuid(question_id, "question_id")
    return await service.get_by_id(question_id)


@router.patch("/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: str,
    data: QuestionUpdate,
    user_id: str = Depends(require_auth),
    service: QuestionService = Depends(get_service),
):
    parse_uuid(question_id, "question_id")
    return await service.update(question_id, data, user_id)


@router.delete("/{question_id}", status_code=204)
async def delete_question(
    question_id: str,
    user_id: str = Depends(require_auth),
    service: QuestionService = Depends(get_service),
):
    parse_uuid(question_id, "question_id")
    await service.delete(question_id, user_id)


@router.get("/{question_id}/analysis")
async def get_question_analysis(
    question_id: str,
    force: bool = Query(False, description="Bypass the on-disk cache and re-run Gemini"),
    db: AsyncSession = Depends(get_db),
    service: QuestionService = Depends(get_service),
):
    parse_uuid(question_id, "question_id")

    # 1. Check cache file first (unless ?force=true)
    cache_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cache")
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, f"{question_id}.json")

    if not force and os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    # 2. Get question details
    question = await service.get_by_id(question_id)
    
    # 3. Get FAQs and Discussions in parallel
    faq_stmt = select(PublishedFaq).where(PublishedFaq.deleted_at.is_(None))
    faq_result = await db.execute(faq_stmt)
    faqs = list(faq_result.scalars().all())

    disc_stmt = select(Discussion).where(Discussion.deleted_at.is_(None))
    disc_result = await db.execute(disc_stmt)
    discussions = list(disc_result.scalars().all())

    # 4. Format prompt
    faqs_str = "\n".join([
        f"- ID: {faq.id}\n  Title: {faq.title}\n  Content: {faq.content[:150]}..."
        for faq in faqs
    ])
    discs_str = "\n".join([
        f"- ID: {disc.id}\n  Title: {disc.title}\n  Description: {(disc.description or '')[:150]}..."
        for disc in discussions
    ])

    prompt = f"""You are the CrowdMind AI Duplicate and Knowledge Analysis Assistant.
Your task is to analyze a new user question and match it against our existing database of FAQs and discussions.

New Question Title: {question.title}
New Question Description: {question.description or ''}

Existing FAQs:
{faqs_str}

Existing Discussions:
{discs_str}

Analyze the query:
1. Find if this question is a duplicate of one of the existing FAQs. If a matching FAQ is found with similar semantic intent, return its ID in "similar_faq_id" and calculate a "confidence_score" (0-100) indicating the match confidence (should be 70+ for close matches). If no duplicate is found, "similar_faq_id" should be null and "confidence_score" should represent our overall confidence score for an AI response (generally between 30 and 60).
2. Find the most semantically relevant discussion from the list. If one matches, return its ID in "similar_discussion_id" and its relevance score (0-100) in "relevance_score". Otherwise, "similar_discussion_id" should be null.
3. Generate a structured draft answer ("draft_answer") in a helpful, friendly tone, explaining the resolution. If there is a matched FAQ, your draft answer should explain that this is a duplicate and base its content on the matched FAQ's answer. If not, generate a custom response addressing their specific context.
4. Explain your confidence score and reasoning path in 1 or 2 concise sentences in "analysis_breakdown".

You MUST return a JSON object with EXACTLY the following keys:
- "confidence_score": (int, 0 to 100)
- "draft_answer": (string, markdown text)
- "similar_faq_id": (string or null, the matched FAQ ID UUID)
- "similar_discussion_id": (string or null, the matched discussion ID UUID)
- "analysis_breakdown": (string, 1-2 sentence explanation of reasoning)
- "relevance_score": (int, 0 to 100)

Return ONLY the raw JSON object. Do not include markdown code block formatting (like ```json ... ```)."""

    api_key = settings.gemini_api_key
    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    analysis_data = None
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(gemini_url, json=payload)
            if response.status_code == 200:
                data = response.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                if raw_text.startswith("```"):
                    lines = raw_text.split("\n")
                    if lines[0].startswith("```json"):
                        raw_text = "\n".join(lines[1:-1])
                    elif lines[0].startswith("```"):
                        raw_text = "\n".join(lines[1:-1])
                analysis_data = json.loads(raw_text)
    except Exception as err:
        print("[AI Analysis] Gemini API error:", err)

    if not analysis_data:
        best_faq = None
        for faq in faqs:
            if any(word in faq.title.lower() for word in question.title.lower().split() if len(word) >= 4):
                best_faq = faq
                break

        confidence = 72 if best_faq else 42
        fallback_answer = (
            f"Duplicate Match: {best_faq.title}\n\n{best_faq.content}"
            if best_faq
            else f"Based on our analysis, the exact guidelines for '{question.title}' are missing. "
                 f"Please open a discussion to get a community-sourced answer. "
                 f"In the meantime, see the related discussion below for context."
        )
        analysis_data = {
            "confidence_score": confidence,
            "draft_answer": fallback_answer,
            "similar_faq_id": str(best_faq.id) if best_faq else None,
            "similar_discussion_id": str(discussions[0].id) if discussions else None,
            "analysis_breakdown": "Gemini API request timed out or failed. Displaying fallback keyword matching logic.",
            "relevance_score": 50,
        }

    try:
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass

    try:
        q_id = uuid.UUID(question_id)
        await db.execute(
            update(Question)
            .where(Question.id == q_id)
            .values(ai_analysis_status="completed")
        )
        await db.commit()
    except Exception as db_err:
        print("[AI Analysis] Failed to update db status:", db_err)

    return analysis_data


@router.delete("/{question_id}/analysis/cache", status_code=200)
async def flush_analysis_cache(
    question_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_current_user),
):
    """Delete the on-disk analysis cache for one question. Admin only.

    Use case: the cached analysis is stale (new FAQs published, a discussion
    was answered) and you want the next GET /analysis call to re-run Gemini.
    """
    if user.role not in ("admin", "moderator"):
        raise HTTPException(status_code=403, detail="Admin or moderator role required")
    parse_uuid(question_id, "question_id")
    cache_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "cache", f"{question_id}.json"
    )
    removed = False
    if os.path.exists(cache_path):
        try:
            os.remove(cache_path)
            removed = True
        except OSError as err:
            raise HTTPException(status_code=500, detail=f"Failed to remove cache: {err}")
    return {"question_id": question_id, "cache_removed": removed}


@router.post("/admin/analysis/cache/flush-all", status_code=200)
async def flush_all_analysis_caches(
    user: User = Depends(require_current_user),
):
    """Wipe the entire analysis cache directory. Admin only."""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin role required")
    cache_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cache")
    removed = 0
    if os.path.isdir(cache_dir):
        for name in os.listdir(cache_dir):
            p = os.path.join(cache_dir, name)
            if os.path.isfile(p) and name.endswith(".json"):
                try:
                    os.remove(p)
                    removed += 1
                except OSError:
                    pass
    return {"cache_files_removed": removed}
