from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, model_validator

from app.schemas.base import BaseSchema


class ReportCreate(BaseModel):
    target_type: str = Field(..., serialization_alias="content_type")
    target_id: str = Field(..., serialization_alias="content_id")
    reason: str
    description: str | None = None


class ReportResolve(BaseModel):
    status: str = Field(..., pattern="^(RESOLVED|DISMISSED)$")
    action: str | None = None
    resolution_notes: str | None = Field(None, max_length=2000)


class ReportActionRequest(BaseModel):
    action: str = Field(..., pattern="^(WARN|HIDE|DELETE|ESCALATE|NO_ACTION)$")
    notes: str | None = Field(None, max_length=2000)


class ModerationActionResponse(BaseSchema):
    id: str
    report_id: str | None = None
    target_user_id: str
    moderator_id: str
    action_type: str
    action_reason: str | None = None
    expires_at: datetime | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class ReportResponse(BaseSchema):
    id: str
    target_type: str = Field(serialization_alias="content_type")
    target_id: str = Field(serialization_alias="content_id")
    reason: str
    description: str | None = None
    severity: str = "MEDIUM"
    status: str = "OPEN"
    reported_by: str
    action_taken: str | None = None
    resolution_notes: str | None = None
    resolved_at: datetime | None = None
    resolved_by: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @model_validator(mode="before")
    @classmethod
    def _map_reporter_to_reported_by(cls, data):
        """ORM has reporter_id; schema expects reported_by."""
        if hasattr(data, "__dict__") and not isinstance(data, dict):
            # ORM object: build dict with both keys
            d = {
                "id": data.id,
                "target_type": data.target_type,
                "target_id": data.target_id,
                "reason": data.reason,
                "description": data.description,
                "severity": data.severity,
                "status": data.status,
                "reported_by": data.reporter_id,
                "action_taken": getattr(data, "action_taken", None),
                "resolution_notes": getattr(data, "resolution_notes", None),
                "resolved_at": getattr(data, "resolved_at", None),
                "resolved_by": getattr(data, "resolved_by", None),
                "created_at": data.created_at,
            }
            return d
        if isinstance(data, dict) and "reporter_id" in data and "reported_by" not in data:
            data = {**data, "reported_by": data["reporter_id"]}
        return data


class ReportListResponse(BaseModel):
    items: list[ReportResponse]
    total: int
    page: int
    page_size: int
