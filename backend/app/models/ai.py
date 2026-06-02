import uuid
from datetime import datetime

from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AiRequest(Base):
    __tablename__ = "ai_requests"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    provider: Mapped[str] = mapped_column(String, nullable=False)
    operation_type: Mapped[str] = mapped_column(String, nullable=False)
    prompt_version: Mapped[str | None] = mapped_column(String, nullable=True)
    response_time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    token_usage: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
