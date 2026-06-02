from datetime import datetime
from pydantic import BaseModel, Field


class DiscussionCreate(BaseModel):
    question_id: str | None = None
    title: str = Field(..., min_length=5, max_length=300)
    description: str | None = Field(None, max_length=10000)


class DiscussionUpdate(BaseModel):
    title: str | None = Field(None, min_length=5, max_length=300)
    description: str | None = None
    status: str | None = None


class DiscussionResponse(BaseModel):
    id: str
    question_id: str | None
    created_by: str
    title: str
    description: str | None
    status: str
    view_count: int
    reply_count: int
    participant_count: int
    consensus_score: float | None
    created_at: datetime
    updated_at: datetime | None

    model_config = {"from_attributes": True}


class DiscussionListResponse(BaseModel):
    items: list[DiscussionResponse]
    total: int
    page: int
    page_size: int
