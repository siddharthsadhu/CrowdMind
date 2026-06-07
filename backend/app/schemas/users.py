from datetime import datetime
from pydantic import BaseModel

from app.schemas.base import BaseSchema


class UserResponse(BaseSchema):
    id: str
    clerk_user_id: str | None = None
    username: str
    email: str
    full_name: str
    avatar_url: str | None = None
    bio: str | None = None
    reputation_score: int = 0
    role: str = "user"
    created_at: datetime | None = None
