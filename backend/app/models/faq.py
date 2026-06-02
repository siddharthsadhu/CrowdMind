import uuid
from datetime import datetime

from sqlalchemy import String, Text, Boolean, Integer, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class FaqCandidate(Base):
    __tablename__ = "faq_candidates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    discussion_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("discussions.id"), nullable=False)
    generated_by_ai: Mapped[bool] = mapped_column(Boolean, default=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default="PENDING")
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(onupdate=datetime.utcnow, nullable=True)


class PublishedFaq(Base):
    __tablename__ = "published_faqs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("faq_candidates.id"), nullable=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True, index=True)
    version_number: Mapped[int] = mapped_column(Integer, default=1)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    community_agreement_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    published_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    published_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(onupdate=datetime.utcnow, nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(nullable=True, default=None)


class FaqContributor(Base):
    __tablename__ = "faq_contributors"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faq_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("published_faqs.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    contribution_type: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class FaqSource(Base):
    __tablename__ = "faq_sources"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faq_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("published_faqs.id"), nullable=False)
    source_type: Mapped[str] = mapped_column(String, nullable=False)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class FaqVersion(Base):
    __tablename__ = "faq_versions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faq_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("published_faqs.id"), nullable=False)
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    change_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    approved_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class EvolutionEvent(Base):
    __tablename__ = "evolution_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faq_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("published_faqs.id"), nullable=False)
    version_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("faq_versions.id"), nullable=True)
    event_type: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    triggered_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
