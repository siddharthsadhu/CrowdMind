from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ReportCreate(BaseModel):
    target_type: str = Field(..., serialization_alias="content_type")
    target_id: str = Field(..., serialization_alias="content_id")
    reason: str
    description: str | None = None


class ReportResolve(BaseModel):
    status: str = Field(..., pattern="^(RESOLVED|DISMISSED)$")
    action: str | None = None


class ReportResponse(BaseModel):
    id: str
    target_type: str = Field(serialization_alias="content_type")
    target_id: str = Field(serialization_alias="content_id")
    reason: str
    description: str | None = None
    severity: str = "MEDIUM"
    status: str = "OPEN"
    reported_by: str
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ReportListResponse(BaseModel):
    items: list[ReportResponse]
    total: int
    page: int
    page_size: int
