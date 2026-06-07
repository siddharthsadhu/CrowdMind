"""Knowledge Evolution API.

Endpoints (mounted at /api/v1):

Public (no auth):
- GET  /evolution/events                     recent activity feed
- GET  /evolution/timeline/{faq_id}         version timeline + events for a FAQ
- GET  /evolution/diff/{faq_id}/{v1}/{v2}   line-based diff between two versions
- GET  /faqs/{faq_id}/versions              list of versions (already in faqs router)

Auth required:
- POST /discussions/{id}/synthesize         generate an FAQ candidate (any user)
- POST /faqs/{id}/rollback                  rollback to a prior version (admin only)
"""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth, require_current_user
from app.core.uuid_utils import parse_uuid
from app.models.discussion import Discussion, Reply
from app.models.faq import EvolutionEvent, FaqVersion, PublishedFaq, FaqCandidate
from app.models.user import User
from app.schemas.evolution import (
    EvolutionEventListResponse,
    EvolutionEventResponse,
    EvolutionTimelineEntry,
    FaqTimelineResponse,
    RollbackRequest,
    SynthesisRequest,
    SynthesisResponse,
    VersionDiffResponse,
)
from app.services.evolution import (
    compute_simple_diff,
    list_all_events,
    list_events_for_faq,
    record_event,
    rollback_to_version,
)
from app.services.synthesis import synthesize_from_discussion
from app.services.ai_provider import slugify

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["evolution"])


@router.get("/evolution/events", response_model=EvolutionEventListResponse)
async def get_evolution_events(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    events = await list_all_events(db, limit=min(limit, 200))
    return EvolutionEventListResponse(
        items=[EvolutionEventResponse.model_validate(e.__dict__) for e in events],
        total=len(events),
    )


@router.get("/evolution/timeline/{faq_id}", response_model=FaqTimelineResponse)
async def get_faq_timeline(
    faq_id: str,
    db: AsyncSession = Depends(get_db),
):
    parse_uuid(faq_id, "faq_id")
    faq = (
        await db.execute(
            select(PublishedFaq).where(
                PublishedFaq.id == uuid.UUID(faq_id),
                PublishedFaq.deleted_at.is_(None),
            )
        )
    ).scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    versions = (
        (
            await db.execute(
                select(FaqVersion)
                .where(FaqVersion.faq_id == faq.id)
                .order_by(desc(FaqVersion.version_number))
            )
        )
        .scalars()
        .all()
    )
    events = await list_events_for_faq(db, faq_id)

    timeline: list[EvolutionTimelineEntry] = []
    for v in versions:
        diff_summary = None
        if v.change_summary:
            diff_summary = v.change_summary[:140]
        timeline.append(
            EvolutionTimelineEntry(
                version_id=str(v.id),
                version_number=v.version_number,
                title=v.title,
                change_summary=v.change_summary,
                created_by=str(v.created_by),
                created_at=v.created_at,
                is_current=(v.version_number == faq.version_number),
                diff_summary=diff_summary,
            )
        )

    return FaqTimelineResponse(
        faq_id=faq_id,
        faq_title=faq.title,
        current_version=faq.version_number,
        timeline=timeline,
        events=[EvolutionEventResponse.model_validate(e.__dict__) for e in events],
    )


@router.get("/evolution/diff/{faq_id}/{from_v}/{to_v}", response_model=VersionDiffResponse)
async def get_version_diff(
    faq_id: str,
    from_v: int,
    to_v: int,
    db: AsyncSession = Depends(get_db),
):
    parse_uuid(faq_id, "faq_id")
    if from_v == to_v:
        raise HTTPException(status_code=400, detail="Versions must differ")
    rows = (
        (
            await db.execute(
                select(FaqVersion).where(
                    FaqVersion.faq_id == uuid.UUID(faq_id),
                    FaqVersion.version_number.in_([from_v, to_v]),
                )
            )
        )
        .scalars()
        .all()
    )
    by_num = {v.version_number: v for v in rows}
    if from_v not in by_num or to_v not in by_num:
        raise HTTPException(status_code=404, detail="One or both versions not found")
    old = by_num[from_v].content
    new = by_num[to_v].content
    diff = compute_simple_diff(old, new)
    adds = sum(len(d["after"]) for d in diff if d["op"] in ("insert", "replace"))
    dels = sum(len(d["before"]) for d in diff if d["op"] in ("delete", "replace"))
    return VersionDiffResponse(
        faq_id=faq_id,
        from_version=from_v,
        to_version=to_v,
        diff=diff,
        additions=adds,
        deletions=dels,
    )


@router.post("/discussions/{discussion_id}/synthesize", response_model=SynthesisResponse)
async def synthesize(
    discussion_id: str,
    data: SynthesisRequest = SynthesisRequest(),
    user_id: str = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    parse_uuid(discussion_id, "discussion_id")
    discussion = (
        await db.execute(
            select(Discussion).where(
                Discussion.id == uuid.UUID(discussion_id),
                Discussion.deleted_at.is_(None),
            )
        )
    ).scalar_one_or_none()
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")

    replies = (
        (
            await db.execute(
                select(Reply).where(
                    Reply.discussion_id == discussion.id,
                    Reply.deleted_at.is_(None),
                )
            )
        )
        .scalars()
        .all()
    )

    if not replies:
        raise HTTPException(status_code=400, detail="Discussion has no replies to synthesize from")

    candidate = await synthesize_from_discussion(db, discussion, replies)

    candidate_row = FaqCandidate(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        generated_by_ai=not candidate.used_fallback,
        title=candidate.title,
        content=candidate.content,
        confidence_score=candidate.confidence_score,
        status="PENDING",
    )
    db.add(candidate_row)
    await db.flush()

    await record_event(
        db,
        faq_id=str(discussion.question_id) if discussion.question_id else str(discussion.id),
        event_type="DISCUSSION_SYNTHESIZED",
        description=(
            f"Synthesized candidate for discussion '{discussion.title}' "
            f"(confidence {candidate.confidence_score}%, "
            f"{'AI' if not candidate.used_fallback else 'fallback'})"
        ),
        triggered_by=user_id,
    )
    await db.commit()

    return SynthesisResponse(
        discussion_id=discussion_id,
        candidate_id=str(candidate_row.id),
        title=candidate.title,
        confidence_score=candidate.confidence_score,
        source_reply_ids=candidate.source_reply_ids,
        used_fallback=candidate.used_fallback,
    )


@router.post("/faqs/{faq_id}/rollback", response_model=dict)
async def rollback_faq(
    faq_id: str,
    data: RollbackRequest,
    user: User = Depends(require_current_user),
    db: AsyncSession = Depends(get_db),
):
    parse_uuid(faq_id, "faq_id")
    parse_uuid(data.target_version_id, "target_version_id")
    if user.role not in ("admin", "moderator"):
        raise HTTPException(status_code=403, detail="Admin or moderator role required")
    faq = await rollback_to_version(
        db,
        faq_id=faq_id,
        target_version_id=data.target_version_id,
        triggered_by=str(user.id),
    )
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ or version not found")
    await db.commit()
    return {
        "faq_id": str(faq.id),
        "current_version": faq.version_number,
        "title": faq.title,
    }
