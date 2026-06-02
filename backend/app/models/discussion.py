import uuid
from datetime import datetime

from sqlalchemy import String, Text, Boolean, Integer, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Discussion(Base):
    __tablename__ = "discussions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=True, index=True)
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default="ACTIVE", index=True)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    reply_count: Mapped[int] = mapped_column(Integer, default=0)
    participant_count: Mapped[int] = mapped_column(Integer, default=0)
    consensus_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(onupdate=datetime.utcnow, nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(nullable=True, default=None)


class Reply(Base):
    __tablename__ = "replies"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    discussion_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("discussions.id"), nullable=False, index=True)
    parent_reply_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("replies.id"), nullable=True, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    upvote_count: Mapped[int] = mapped_column(Integer, default=0)
    downvote_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(onupdate=datetime.utcnow, nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(nullable=True, default=None)


class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    target_type: Mapped[str] = mapped_column(String, nullable=False)
    target_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    vote_type: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class ConsensusSignal(Base):
    __tablename__ = "consensus_signals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    discussion_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("discussions.id"), nullable=False)
    reply_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("replies.id"), nullable=True)
    agreement_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    trust_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    reputation_weight: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
