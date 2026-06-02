from fastapi import HTTPException, status

from app.repositories.votes import VoteRepository
from app.schemas.votes import VoteCreate, VoteResponse


class VoteService:
    def __init__(self, repo: VoteRepository):
        self.repo = repo

    async def create_or_update(self, user_id: str, data: VoteCreate) -> VoteResponse:
        vote = await self.repo.upsert(
            user_id=user_id,
            target_type=data.target_type,
            target_id=data.target_id,
            vote_type=data.vote_type,
        )
        return VoteResponse.model_validate(vote)

    async def remove(self, user_id: str, target_type: str, target_id: str) -> None:
        deleted = await self.repo.remove(user_id, target_type, target_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vote not found")
