"""Knowledge evolution: versioning + audit trail + rollback.

EvolutionEvent kinds:
- "CANDIDATE_GENERATED"   — AI produced an FAQ candidate from a discussion
- "CANDIDATE_APPROVED"    — moderator approved a candidate
- "CANDIDATE_REJECTED"    — moderator rejected
- "FAQ_PUBLISHED"         — a candidate became a published FAQ
- "FAQ_UPDATED"           — content was edited (creates a new FaqVersion)
- "FAQ_ROLLBACK"          — content was rolled back to a prior version
- "DISCUSSION_SYNTHESIZED"— a synthesis run completed
- "CONSENSUS_RECORDED"    — consensus score computed
"""
from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.faq import EvolutionEvent, FaqVersion, PublishedFaq
from app.models.user import User
from app.services.ai_provider import slugify

logger = logging.getLogger(__name__)


@dataclass
class EvolutionEventSummary:
    id: str
    faq_id: str
    version_id: str | None
    event_type: str
    description: str | None
    triggered_by: str | None
    created_at: datetime


def _to_summary(e: EvolutionEvent) -> EvolutionEventSummary:
    return EvolutionEventSummary(
        id=str(e.id),
        faq_id=str(e.faq_id),
        version_id=str(e.version_id) if e.version_id else None,
        event_type=e.event_type,
        description=e.description,
        triggered_by=str(e.triggered_by) if e.triggered_by else None,
        created_at=e.created_at,
    )


async def record_event(
    db: AsyncSession,
    *,
    faq_id: str,
    event_type: str,
    description: str | None = None,
    version_id: str | None = None,
    triggered_by: str | None = None,
) -> EvolutionEvent:
    """Append-only write to the evolution_events audit log."""
    event = EvolutionEvent(
        id=uuid.uuid4(),
        faq_id=uuid.UUID(faq_id) if isinstance(faq_id, str) else faq_id,
        version_id=uuid.UUID(version_id) if version_id and isinstance(version_id, str) else version_id,
        event_type=event_type,
        description=description,
        triggered_by=uuid.UUID(triggered_by) if triggered_by and isinstance(triggered_by, str) else triggered_by,
        created_at=datetime.now(timezone.utc),
    )
    db.add(event)
    await db.flush()
    return event


async def list_events_for_faq(
    db: AsyncSession, faq_id: str
) -> list[EvolutionEventSummary]:
    stmt = (
        select(EvolutionEvent)
        .where(EvolutionEvent.faq_id == uuid.UUID(faq_id))
        .order_by(desc(EvolutionEvent.created_at))
    )
    rows = (await db.execute(stmt)).scalars().all()
    return [_to_summary(r) for r in rows]


async def list_all_events(
    db: AsyncSession, *, limit: int = 100
) -> list[EvolutionEventSummary]:
    stmt = select(EvolutionEvent).order_by(desc(EvolutionEvent.created_at)).limit(limit)
    rows = (await db.execute(stmt)).scalars().all()
    return [_to_summary(r) for r in rows]


async def get_version(db: AsyncSession, version_id: str) -> FaqVersion | None:
    stmt = select(FaqVersion).where(FaqVersion.id == uuid.UUID(version_id))
    return (await db.execute(stmt)).scalar_one_or_none()


async def rollback_to_version(
    db: AsyncSession,
    *,
    faq_id: str,
    target_version_id: str,
    triggered_by: str,
) -> PublishedFaq | None:
    """Roll a published FAQ back to a prior version.

    This:
    1. Snapshots the current state as a new FaqVersion (so rollback is reversible)
    2. Overwrites the FAQ's title/content with the target version's
    3. Bumps the version_number
    4. Logs a FAQ_ROLLBACK event
    """
    faq = (
        await db.execute(
            select(PublishedFaq).where(
                PublishedFaq.id == uuid.UUID(faq_id),
                PublishedFaq.deleted_at.is_(None),
            )
        )
    ).scalar_one_or_none()
    if not faq:
        return None

    target = await get_version(db, target_version_id)
    if not target or str(target.faq_id) != faq_id:
        return None

    snapshot_version = FaqVersion(
        id=uuid.uuid4(),
        faq_id=faq.id,
        version_number=faq.version_number,
        title=faq.title,
        content=faq.content,
        change_summary=f"Auto-snapshot before rollback to v{target.version_number}",
        created_by=uuid.UUID(triggered_by),
    )
    db.add(snapshot_version)
    await db.flush()

    faq.title = target.title
    faq.content = target.content
    faq.version_number = (faq.version_number or 0) + 1
    faq.updated_at = datetime.now(timezone.utc)

    rollback_version = FaqVersion(
        id=uuid.uuid4(),
        faq_id=faq.id,
        version_number=faq.version_number,
        title=faq.title,
        content=faq.content,
        change_summary=f"Rolled back to v{target.version_number}",
        created_by=uuid.UUID(triggered_by),
    )
    db.add(rollback_version)
    await db.flush()

    await record_event(
        db,
        faq_id=faq_id,
        event_type="FAQ_ROLLBACK",
        description=f"Rolled back to v{target.version_number}; pre-rollback snapshot saved as v{snapshot_version.version_number}",
        version_id=str(rollback_version.id),
        triggered_by=triggered_by,
    )
    return faq


def compute_simple_diff(old: str, new: str, *, context: int = 40) -> list[dict[str, Any]]:
    """A minimal line-based diff for the evolution timeline UI.

    Returns a list of {op, text, before, after} entries. Not a full Myers
    diff — sufficient to show red/green hunks in a small panel.
    """
    old_lines = (old or "").splitlines()
    new_lines = (new or "").splitlines()
    from difflib import SequenceMatcher
    sm = SequenceMatcher(a=old_lines, b=new_lines, autojunk=False)
    out: list[dict[str, Any]] = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        out.append({
            "op": tag,
            "before": old_lines[i1:i2],
            "after": new_lines[j1:j2],
        })
    return out
