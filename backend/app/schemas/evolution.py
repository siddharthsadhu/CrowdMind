"""Pydantic schemas for the Knowledge Evolution API."""
from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas.base import BaseSchema


class EvolutionEventResponse(BaseSchema):
    id: str
    faq_id: str
    version_id: str | None
    event_type: str
    description: str | None
    triggered_by: str | None
    created_at: datetime


class EvolutionEventListResponse(BaseModel):
    items: list[EvolutionEventResponse]
    total: int


class EvolutionTimelineEntry(BaseModel):
    version_id: str
    version_number: int
    title: str
    change_summary: str | None
    created_by: str
    created_at: datetime
    is_current: bool
    diff_summary: str | None = None


class FaqTimelineResponse(BaseModel):
    faq_id: str
    faq_title: str
    current_version: int
    timeline: list[EvolutionTimelineEntry]
    events: list[EvolutionEventResponse]


class VersionDiffResponse(BaseModel):
    faq_id: str
    from_version: int
    to_version: int
    diff: list[dict] = Field(default_factory=list)
    additions: int = 0
    deletions: int = 0


class RollbackRequest(BaseModel):
    target_version_id: str


class SynthesisRequest(BaseModel):
    force: bool = False


class SynthesisResponse(BaseModel):
    discussion_id: str
    candidate_id: str | None
    title: str
    confidence_score: float
    source_reply_ids: list[str]
    used_fallback: bool
