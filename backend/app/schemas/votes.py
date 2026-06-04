from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas.base import BaseSchema


class VoteCreate(BaseModel):
    target_type: str = Field(..., pattern="^(discussion|reply)$")
    target_id: str
    vote_type: str = Field(..., pattern="^(UPVOTE|DOWNVOTE)$")


class VoteResponse(BaseSchema):
    id: str
    user_id: str
    target_type: str
    target_id: str
    vote_type: str
    created_at: datetime
