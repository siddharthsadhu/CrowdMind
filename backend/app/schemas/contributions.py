from datetime import datetime
from pydantic import BaseModel
from typing import Literal


ContributionType = Literal["question", "reply", "discussion", "faq", "faq_version"]


class ContributionItem(BaseModel):
    type: ContributionType
    id: str
    title: str
    snippet: str | None = None
    url: str | None = None
    status: str | None = None
    created_at: datetime | None = None
    parent_id: str | None = None
    parent_title: str | None = None


class ContributionSummary(BaseModel):
    questions: int = 0
    replies: int = 0
    discussions: int = 0
    faqs_published: int = 0
    faq_versions: int = 0
    total: int = 0


class ContributionsResponse(BaseModel):
    items: list[ContributionItem]
    summary: ContributionSummary
