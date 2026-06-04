from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.base import BaseSchema


class SavedCreate(BaseModel):
    target_type: str = Field(..., pattern="^(FAQ|DISCUSSION|QUESTION|REPLY)$")
    target_id: str


class SavedResponse(BaseSchema):
    id: str
    target_type: str
    target_id: str
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class SavedListResponse(BaseModel):
    items: list[SavedResponse]
    total: int


class SavedIdItem(BaseModel):
    target_type: str
    target_id: str
