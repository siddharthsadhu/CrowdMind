from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas.base import BaseSchema


class ReplyCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)
    parent_reply_id: str | None = None


class ReplyUpdate(BaseModel):
    content: str | None = Field(None, min_length=1, max_length=10000)


class ReplyResponse(BaseSchema):
    id: str
    discussion_id: str
    parent_reply_id: str | None
    user_id: str
    content: str
    is_accepted: bool
    upvote_count: int
    downvote_count: int
    created_at: datetime
    updated_at: datetime | None


class ReplyListResponse(BaseModel):
    items: list[ReplyResponse]
    total: int
    page: int
    page_size: int
