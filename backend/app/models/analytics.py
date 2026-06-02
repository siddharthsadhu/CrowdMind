import uuid
from datetime import datetime, date

from sqlalchemy import String, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    entity_type: Mapped[str | None] = mapped_column(String, nullable=True)
    entity_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    meta_data: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True, default=None)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, index=True)


class DailyAnalytics(Base):
    __tablename__ = "daily_analytics"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    new_users: Mapped[int] = mapped_column(Integer, default=0)
    new_questions: Mapped[int] = mapped_column(Integer, default=0)
    new_discussions: Mapped[int] = mapped_column(Integer, default=0)
    new_faqs: Mapped[int] = mapped_column(Integer, default=0)
    active_users: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
