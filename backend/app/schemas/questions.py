from datetime import datetime
from pydantic import BaseModel, Field


class QuestionCreate(BaseModel):
    title: str = Field(..., min_length=10, max_length=200)
    description: str | None = Field(None, max_length=5000)
    category_id: str | None = None


class QuestionUpdate(BaseModel):
    title: str | None = Field(None, min_length=10, max_length=200)
    description: str | None = None
    category_id: str | None = None
    status: str | None = None


class QuestionResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: str | None
    category_id: str | None
    status: str
    ai_analysis_status: str
    created_at: datetime
    updated_at: datetime | None

    model_config = {"from_attributes": True}


class QuestionListResponse(BaseModel):
    items: list[QuestionResponse]
    total: int
    page: int
    page_size: int
