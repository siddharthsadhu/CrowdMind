"""FAQ candidate synthesis.

The synthesis flow:

1. Take a discussion + its replies + the (optionally) accepted reply
2. Build a focused prompt for the AI that:
   - Lists all replies with their upvote / acceptance status
   - Instructs the model to base its draft on the highest-quality content
   - Emphasizes that AI ASSISTS — the community is the source of truth
   - Returns structured JSON (title, content, confidence_score, source_reply_ids)
3. On failure, fall back to a deterministic summary of the accepted reply
"""
from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.discussion import Discussion, Reply
from app.services.ai_provider import call_json
from app.services.ai_provider import slugify

logger = logging.getLogger(__name__)


@dataclass
class SynthesizedCandidate:
    title: str
    content: str
    confidence_score: float
    source_reply_ids: list[str]
    raw_ai_response: dict[str, Any] | None
    used_fallback: bool


def _format_replies_for_prompt(replies: list[Reply]) -> str:
    """Render replies as a numbered list the model can quote from."""
    sorted_replies = sorted(
        replies,
        key=lambda r: (r.is_accepted, r.upvote_count - r.downvote_count),
        reverse=True,
    )
    lines: list[str] = []
    for idx, r in enumerate(sorted_replies, start=1):
        marker = " [ACCEPTED]" if r.is_accepted else ""
        marker += f" [score: +{r.upvote_count}/-{r.downvote_count}]"
        lines.append(f"{idx}. (id={r.id}){marker}\n{r.content[:600]}")
    return "\n\n".join(lines) if lines else "(no replies yet)"


SYNTHESIS_PROMPT = """You are the CrowdMind Knowledge Synthesis Assistant.

Your job is to turn a community discussion into a clear, reusable FAQ
candidate. The community is the source of truth — you ASSIST by distilling
their contributions, not by inventing new information.

Discussion title: {title}
Discussion description: {description}

Replies (ordered by quality — accepted first, then highest score):
{replies}

Write a synthesized FAQ candidate.

Rules:
- Base the answer ONLY on the replies above. Quote, summarize, or
  re-organize — do NOT introduce facts that aren't in the discussion.
- Prefer the accepted reply as the primary source if one exists.
- If replies conflict, present the majority view and note the disagreement
  briefly in a "## Open questions" section at the end.
- Keep the title short (under 80 chars), in question form.
- The body should be 2-5 short paragraphs, with a final "## Key takeaways"
  bullet list of 3-5 points.
- confidence_score is your honest 0-100 estimate of how well the
  community's replies cover this question. 90+ means strong agreement,
  60-80 means decent coverage, below 50 means still too uncertain.
- source_reply_ids is the list of reply UUIDs that informed this draft.

Return ONLY a JSON object with these keys:
- "title": string
- "content": string (markdown)
- "confidence_score": number 0-100
- "source_reply_ids": array of strings (reply UUIDs)
- "reasoning": one-sentence explanation of how you chose the source replies
"""


def _build_synthesis_prompt(discussion: Discussion, replies: list[Reply]) -> str:
    return SYNTHESIS_PROMPT.format(
        title=discussion.title,
        description=(discussion.description or "")[:500],
        replies=_format_replies_for_prompt(replies),
    )


def _fallback_synthesis(discussion: Discussion, replies: list[Reply]) -> SynthesizedCandidate:
    """Deterministic synthesis when AI is unavailable.

    Picks the accepted reply (or highest-scored reply) and wraps it in
    a minimal FAQ structure.
    """
    accepted = next((r for r in replies if r.is_accepted), None)
    if accepted:
        primary = accepted
    elif replies:
        primary = max(replies, key=lambda r: r.upvote_count - r.downvote_count)
    else:
        primary = None

    if primary is None:
        return SynthesizedCandidate(
            title=discussion.title,
            content=(
                "This discussion has no replies yet. Once the community "
                "weighs in, an FAQ candidate will be generated."
            ),
            confidence_score=20.0,
            source_reply_ids=[],
            raw_ai_response=None,
            used_fallback=True,
        )

    return SynthesizedCandidate(
        title=discussion.title[:80].rstrip() + ("?" if not discussion.title.endswith("?") else ""),
        content=(
            f"## Community answer\n\n{primary.content}\n\n"
            f"## Key takeaways\n\n"
            f"- This answer was provided by a community contributor and "
            f"is awaiting moderator review."
        ),
        confidence_score=45.0,
        source_reply_ids=[str(primary.id)],
        raw_ai_response=None,
        used_fallback=True,
    )


async def synthesize_from_discussion(
    db: AsyncSession,
    discussion: Discussion,
    replies: list[Reply],
) -> SynthesizedCandidate:
    """Build an FAQ candidate from a discussion + its replies."""
    prompt = _build_synthesis_prompt(discussion, replies)
    ai = await call_json(prompt, max_output_tokens=1500)

    if not ai or not ai.get("title") or not ai.get("content"):
        logger.info("[Synthesis] AI returned empty/partial, using fallback for discussion %s", discussion.id)
        return _fallback_synthesis(discussion, replies)

    try:
        confidence = float(ai.get("confidence_score", 60))
    except (TypeError, ValueError):
        confidence = 60.0
    confidence = max(0.0, min(100.0, confidence))

    source_ids_raw = ai.get("source_reply_ids") or []
    source_reply_ids: list[str] = []
    for sid in source_ids_raw:
        if isinstance(sid, str) and sid:
            source_reply_ids.append(sid)

    return SynthesizedCandidate(
        title=str(ai["title"]).strip()[:300],
        content=str(ai["content"]).strip(),
        confidence_score=confidence,
        source_reply_ids=source_reply_ids or (
            [str(r.id) for r in replies[:3]] if replies else []
        ),
        raw_ai_response=ai,
        used_fallback=False,
    )
