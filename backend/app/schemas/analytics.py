from datetime import date
from pydantic import BaseModel


class AnalyticsEventCreate(BaseModel):
    event_name: str
    entity_type: str | None = None
    entity_id: str | None = None


class DashboardResponse(BaseModel):
    total_users: int = 0
    total_questions: int = 0
    total_discussions: int = 0
    total_faqs: int = 0
    total_reports_open: int = 0


class DailyAnalyticsResponse(BaseModel):
    date: date
    new_users: int = 0
    new_questions: int = 0
    new_discussions: int = 0
    new_faqs: int = 0
    active_users: int = 0
