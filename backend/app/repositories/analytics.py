import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import AnalyticsEvent, DailyAnalytics
from app.models.user import User
from app.models.question import Question
from app.models.discussion import Discussion
from app.models.faq import PublishedFaq
from app.models.moderation import Report


class AnalyticsRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def record_event(self, event_name: str, user_id: str | None = None,
                            entity_type: str | None = None, entity_id: str | None = None) -> AnalyticsEvent:
        event = AnalyticsEvent(
            id=uuid.uuid4(),
            event_name=event_name,
            user_id=uuid.UUID(user_id) if user_id else None,
            entity_type=entity_type,
            entity_id=uuid.UUID(entity_id) if entity_id else None,
        )
        self.session.add(event)
        await self.session.flush()
        return event

    async def get_dashboard(self) -> dict:
        total_users = await self.session.scalar(select(func.count(User.id))) or 0
        total_questions = await self.session.scalar(
            select(func.count(Question.id)).where(Question.deleted_at.is_(None))
        ) or 0
        total_discussions = await self.session.scalar(
            select(func.count(Discussion.id)).where(Discussion.deleted_at.is_(None))
        ) or 0
        total_faqs = await self.session.scalar(
            select(func.count(PublishedFaq.id)).where(PublishedFaq.deleted_at.is_(None))
        ) or 0
        total_reports_open = await self.session.scalar(
            select(func.count(Report.id)).where(Report.status == "OPEN")
        ) or 0
        return {
            "total_users": total_users,
            "total_questions": total_questions,
            "total_discussions": total_discussions,
            "total_faqs": total_faqs,
            "total_reports_open": total_reports_open,
        }
