from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas.base import BaseSchema


class FaqCandidateResponse(BaseSchema):
    id: str
    discussion_id: str
    generated_by_ai: bool
    title: str
    content: str
    confidence_score: float | None
    status: str
    created_at: datetime
    updated_at: datetime | None


class FaqCandidateListResponse(BaseModel):
    items: list[FaqCandidateResponse]
    total: int
    page: int
    page_size: int


class FaqCandidateReview(BaseModel):
    status: str = Field(..., pattern="^(APPROVED|REJECTED|NEEDS_REVISION)$")


class PublishedFaqResponse(BaseSchema):
    id: str
    slug: str
    title: str
    content: str
    category_id: str | None
    version_number: int
    confidence_score: float | None
    community_agreement_score: float | None
    published_by: str
    published_at: datetime
    created_at: datetime
    updated_at: datetime | None


class PublishedFaqListResponse(BaseModel):
    items: list[PublishedFaqResponse]
    total: int
    page: int
    page_size: int


class PublishedFaqUpdate(BaseModel):
    title: str | None = Field(None, min_length=5, max_length=300)
    content: str | None = None
    category_id: str | None = None


class FaqVersionResponse(BaseSchema):
    id: str
    faq_id: str
    version_number: int
    title: str
    content: str
    change_summary: str | None
    created_by: str
    created_at: datetime


class FaqVersionListResponse(BaseModel):
    items: list[FaqVersionResponse]
    total: int
