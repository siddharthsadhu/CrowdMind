from datetime import datetime
from pydantic import BaseModel


class UserResponse(BaseModel):
    id: str
    clerk_user_id: str
    username: str
    email: str
    full_name: str
    avatar_url: str | None = None
    bio: str | None = None
    reputation_score: int = 0
    role: str = "user"
    created_at: datetime | None = None

    model_config = {"from_attributes": True}
