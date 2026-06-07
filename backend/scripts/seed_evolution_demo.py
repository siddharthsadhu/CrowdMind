"""Seed the flagship Knowledge Evolution demo: 'ViBe Team Formation Policy'.

Creates 1 published FAQ with 4 historical versions (v1.0 → v4.0) and 3
evolution events (FAQ_PUBLISHED, FAQ_UPDATED x2, FAQ_UPDATED with rollback
recovery). Run after `seed.py` to layer this on top.

Usage:
    .venv\\Scripts\\python.exe -m scripts.seed_evolution_demo
"""
from __future__ import annotations

import asyncio
import sys
import uuid
from datetime import datetime, timezone, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory
from app.models.faq import (
    FaqCandidate,
    FaqVersion,
    PublishedFaq,
    EvolutionEvent,
)


FLAGSHIP_TITLE = "ViBe Team Formation Policy"
FLAGSHIP_SLUG = "vibe-team-formation-policy"


async def _lookup_ids(session: AsyncSession) -> tuple[uuid.UUID, uuid.UUID, uuid.UUID]:
    """Fetch a real discussion_id, system user, and category from the DB.

    The seed needs valid FK targets. We use the first row of each that
    exists, or fall back to skipping the FK if none found.
    """
    from app.models.discussion import Discussion
    from app.models.user import User
    from app.models.question import Category

    discussion = (
        await session.execute(
            select(Discussion).where(Discussion.deleted_at.is_(None)).limit(1)
        )
    ).scalar_one_or_none()
    user = (await session.execute(select(User).limit(1))).scalar_one_or_none()
    category = (await session.execute(select(Category).limit(1))).scalar_one_or_none()
    if not (discussion and user and category):
        raise RuntimeError(
            "Cannot seed evolution demo: need at least one discussion, user, and category in DB"
        )
    return discussion.id, user.id, category.id


VERSIONS = [
    {
        "version_number": 1,
        "title": "ViBe Team Formation Policy",
        "content": (
            "## Overview\n\n"
            "ViBe teams consist of 3 students formed by faculty in Phase 1.\n\n"
            "## Rules\n\n"
            "- Faculty assigns team membership.\n"
            "- Teams are formed before the first checkpoint.\n"
            "- Each team picks one project track at the kickoff.\n"
        ),
        "change_summary": "Initial publication",
        "days_ago": 120,
    },
    {
        "version_number": 2,
        "title": "ViBe Team Formation Policy",
        "content": (
            "## Overview\n\n"
            "ViBe teams consist of 3-4 students formed during the first 2 weeks.\n\n"
            "## Rules\n\n"
            "- Faculty assigns initial membership; students may swap within week 2.\n"
            "- Teams select a project track at the end of week 2.\n"
            "- Late additions are at the coordinator's discretion.\n"
        ),
        "change_summary": "Added swap window and team size flexibility",
        "days_ago": 90,
    },
    {
        "version_number": 3,
        "title": "ViBe Team Formation Policy",
        "content": (
            "## Overview\n\n"
            "ViBe teams consist of 3-4 students. Self-formation is allowed with\n"
            "faculty approval.\n\n"
            "## Rules\n\n"
            "- Self-formed teams submit membership by end of week 2.\n"
            "- Faculty assigns unformed students to existing teams.\n"
            "- Team size is strictly 3-4 (no exceptions).\n"
            "- All teams must be finalized before the first checkpoint.\n"
        ),
        "change_summary": "Enabled self-formation; capped team size at 3-4",
        "days_ago": 30,
    },
    {
        "version_number": 4,
        "title": "ViBe Team Formation Policy",
        "content": (
            "## Overview\n\n"
            "ViBe teams consist of 3-4 students. Self-formation is the default;\n"
            "faculty only intervenes when self-formation fails.\n\n"
            "## Rules\n\n"
            "- Students form their own teams during the first 2 weeks.\n"
            "- Faculty intervention is reserved for unformed students or\n"
            "  team-size imbalances at the end of week 2.\n"
            "- Team size is 3-4 students.\n"
            "- A signed NOC is required for any team change after Phase 1.\n"
            "- All teams must be finalized before the first checkpoint.\n"
        ),
        "change_summary": "Made self-formation the default; added NOC requirement",
        "days_ago": 7,
    },
]


EVENTS = [
    {
        "event_type": "FAQ_PUBLISHED",
        "description": "Initial publication of the ViBe Team Formation Policy",
        "days_ago": 120,
    },
    {
        "event_type": "DISCUSSION_SYNTHESIZED",
        "description": (
            "Thread #482 'team formation' reached consensus (87%) — policy updated "
            "to allow self-formation within week 2"
        ),
        "days_ago": 90,
    },
    {
        "event_type": "FAQ_UPDATED",
        "description": (
            "Coordinator pushed policy v3.0: self-formation enabled, "
            "team size strictly capped at 3-4"
        ),
        "days_ago": 30,
    },
    {
        "event_type": "FAQ_UPDATED",
        "description": (
            "v4.0 published: NOC requirement added per auditor feedback after "
            "Phase 1 retro"
        ),
        "days_ago": 7,
    },
]


async def seed_one(session: AsyncSession, discussion_id, user_id, category_id) -> bool:
    """Seed the flagship FAQ. Returns True if seeded, False if already present."""
    existing = (
        await session.execute(
            select(PublishedFaq).where(PublishedFaq.slug == FLAGSHIP_SLUG)
        )
    ).scalar_one_or_none()
    if existing:
        print(f"[seed_evolution_demo] FAQ '{FLAGSHIP_SLUG}' already exists (id={existing.id}), skipping")
        return False

    faq_id = uuid.uuid4()
    candidate_id = uuid.uuid4()
    now = datetime.now(timezone.utc)

    candidate = FaqCandidate(
        id=candidate_id,
        discussion_id=discussion_id,
        generated_by_ai=False,
        title=VERSIONS[0]["title"],
        content=VERSIONS[0]["content"],
        confidence_score=82.0,
        status="APPROVED",
    )
    session.add(candidate)

    faq = PublishedFaq(
        id=faq_id,
        candidate_id=candidate_id,
        slug=FLAGSHIP_SLUG,
        title=VERSIONS[-1]["title"],
        content=VERSIONS[-1]["content"],
        category_id=category_id,
        version_number=VERSIONS[-1]["version_number"],
        confidence_score=88.0,
        community_agreement_score=87.0,
        published_by=user_id,
    )
    session.add(faq)
    await session.flush()

    version_ids: list[uuid.UUID] = []
    for spec in VERSIONS:
        ver_id = uuid.uuid4()
        version_ids.append(ver_id)
        ver = FaqVersion(
            id=ver_id,
            faq_id=faq_id,
            version_number=spec["version_number"],
            title=spec["title"],
            content=spec["content"],
            change_summary=spec["change_summary"],
            created_by=user_id,
            created_at=(now - timedelta(days=spec["days_ago"])).replace(tzinfo=None),
        )
        session.add(ver)
    await session.flush()

    for ev_spec, ver_id in zip(EVENTS, [version_ids[0], None, version_ids[2], version_ids[3]]):
        ev = EvolutionEvent(
            id=uuid.uuid4(),
            faq_id=faq_id,
            version_id=ver_id,
            event_type=ev_spec["event_type"],
            description=ev_spec["description"],
            triggered_by=user_id,
            created_at=(now - timedelta(days=ev_spec["days_ago"])).replace(tzinfo=None),
        )
        session.add(ev)

    await session.commit()
    print(f"[seed_evolution_demo] Seeded flagship FAQ: {FLAGSHIP_TITLE}")
    print(f"  id={faq_id}")
    print(f"  slug={FLAGSHIP_SLUG}")
    print(f"  versions={len(VERSIONS)}  events={len(EVENTS)}")
    return True


async def main():
    async with async_session_factory() as session:
        try:
            discussion_id, user_id, category_id = await _lookup_ids(session)
        except RuntimeError as e:
            print(f"[seed_evolution_demo] {e}")
            sys.exit(1)

        ok = await seed_one(session, discussion_id, user_id, category_id)
        if not ok:
            sys.exit(0)
    print("[seed_evolution_demo] done")


if __name__ == "__main__":
    asyncio.run(main())
