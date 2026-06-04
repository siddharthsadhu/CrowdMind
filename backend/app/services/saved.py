from fastapi import HTTPException, status

from app.repositories.saved import SavedKnowledgeRepository
from app.schemas.saved import SavedCreate, SavedResponse, SavedListResponse, SavedIdItem
from builtins import list as _builtin_list  # avoid shadowing


class SavedKnowledgeService:
    def __init__(self, repo: SavedKnowledgeRepository):
        self.repo = repo

    async def create(self, user_id: str, data: SavedCreate) -> SavedResponse:
        sk = await self.repo.create(user_id, data.target_type, data.target_id)
        return SavedResponse.model_validate(sk)

    async def list_saved(self, user_id: str) -> SavedListResponse:
        items, total = await self.repo.list_by_user(user_id)
        return SavedListResponse(
            items=[SavedResponse.model_validate(s) for s in items],
            total=total,
        )

    async def list_ids(self, user_id: str) -> _builtin_list[SavedIdItem]:
        rows = await self.repo.list_ids_by_user(user_id)
        return [SavedIdItem(**r) for r in rows]

    async def delete(self, user_id: str, target_type: str, target_id: str) -> None:
        ok = await self.repo.delete(user_id, target_type, target_id)
        if not ok:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved item not found")
