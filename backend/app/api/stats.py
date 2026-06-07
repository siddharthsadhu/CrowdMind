"""Public stats for landing page."""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, desc, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.faq import PublishedFaq, FaqCandidate
from app.models.discussion import Discussion
from app.models.question import Question
from app.models.user import User
from app.models.analytics import AnalyticsEvent
from app.schemas.faqs import PublishedFaqResponse, PublishedFaqListResponse

router = APIRouter(prefix="/api/v1/stats", tags=["stats"])


@router.get("/summary")
async def get_summary(db: AsyncSession = Depends(get_db)) -> dict:
    total_faqs = await db.scalar(
        select(func.count()).select_from(PublishedFaq).where(PublishedFaq.deleted_at.is_(None))
    ) or 0
    total_discussions = await db.scalar(
        select(func.count()).select_from(Discussion).where(Discussion.deleted_at.is_(None))
    ) or 0
    total_users = await db.scalar(select(func.count()).select_from(User)) or 0
    total_questions = await db.scalar(select(func.count()).select_from(Question)) or 0
    resolved_discussions = await db.scalar(
        select(func.count()).select_from(Discussion).where(
            Discussion.deleted_at.is_(None),
            Discussion.status.in_(["ANSWERED", "RESOLVED"]),
        )
    ) or 0
    resolution_rate = (
        round((resolved_discussions / total_discussions) * 100, 1) if total_discussions else 0.0
    )
    return {
        "total_faqs": total_faqs,
        "total_discussions": total_discussions,
        "total_users": total_users,
        "total_questions": total_questions,
        "resolved_discussions": resolved_discussions,
        "resolution_rate": resolution_rate,
    }


@router.get("/trending-faqs", response_model=PublishedFaqListResponse)
async def get_trending_faqs(
    limit: int = Query(4, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
) -> PublishedFaqListResponse:
    """Top N FAQs by recent faq_view events + published_at recency boost.

    Score = view_count_last_30d * 1.0 + recency_boost
    recency_boost = max(0, 30 - days_since_published) * 0.1
    """
    cutoff = (datetime.now(timezone.utc) - timedelta(days=30)).replace(tzinfo=None)

    view_count_subq = (
        select(
            AnalyticsEvent.entity_id.label("faq_id"),
            func.count(AnalyticsEvent.id).label("views"),
        )
        .where(
            AnalyticsEvent.event_name == "faq_view",
            AnalyticsEvent.entity_type == "faq",
            AnalyticsEvent.created_at >= cutoff,
        )
        .group_by(AnalyticsEvent.entity_id)
        .subquery()
    )

    days_old = func.extract("day", func.now() - PublishedFaq.published_at)
    recency_boost = case(
        (days_old < 30, (30 - days_old) * 0.1),
        else_=0.0,
    )
    score = func.coalesce(view_count_subq.c.views, 0) + recency_boost

    stmt = (
        select(PublishedFaq, score.label("trend_score"))
        .outerjoin(view_count_subq, view_count_subq.c.faq_id == PublishedFaq.id)
        .where(PublishedFaq.deleted_at.is_(None))
        .order_by(desc("trend_score"), desc(PublishedFaq.published_at))
        .limit(limit)
    )
    result = await db.execute(stmt)
    rows = result.all()
    items = [PublishedFaqResponse.model_validate(row[0]) for row in rows]
    return PublishedFaqListResponse(items=items, total=len(items), page=1, page_size=limit)
