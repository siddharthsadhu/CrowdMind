from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class NotificationResponse(BaseModel):
    id: str
    notif_type: str = Field(serialization_alias="type")
    title: str
    message: str | None = Field(None, serialization_alias="body")
    is_read: bool = Field(serialization_alias="read")
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class NotificationListResponse(BaseModel):
    items: list[NotificationResponse]
    total: int
    page: int
    page_size: int
