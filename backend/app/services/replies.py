from fastapi import HTTPException, status

from app.repositories.replies import ReplyRepository
from app.schemas.replies import ReplyCreate, ReplyUpdate, ReplyResponse, ReplyListResponse


class ReplyService:
    def __init__(self, repo: ReplyRepository):
        self.repo = repo

    async def create(self, discussion_id: str, user_id: str, data: ReplyCreate) -> ReplyResponse:
        reply = await self.repo.create(
            discussion_id=discussion_id,
            user_id=user_id,
            content=data.content,
            parent_reply_id=data.parent_reply_id,
        )
        return ReplyResponse.model_validate(reply)

    async def get_by_id(self, reply_id: str) -> ReplyResponse:
        reply = await self.repo.get_by_id(reply_id)
        if not reply:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reply not found")
        return ReplyResponse.model_validate(reply)

    async def list_by_discussion(
        self,
        discussion_id: str,
        page: int = 1,
        page_size: int = 50,
    ) -> ReplyListResponse:
        items, total = await self.repo.list_by_discussion(
            discussion_id=discussion_id,
            page=page,
            page_size=page_size,
        )
        return ReplyListResponse(
            items=[ReplyResponse.model_validate(r) for r in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def update(self, reply_id: str, data: ReplyUpdate, user_id: str) -> ReplyResponse:
        reply = await self.repo.get_by_id(reply_id)
        if not reply:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reply not found")
        if str(reply.user_id) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this reply")
        update_data = {k: v for k, v in data.model_dump(exclude_none=True).items()}
        updated = await self.repo.update(reply_id, update_data)
        return ReplyResponse.model_validate(updated)

    async def delete(self, reply_id: str, user_id: str) -> None:
        reply = await self.repo.get_by_id(reply_id)
        if not reply:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reply not found")
        if str(reply.user_id) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this reply")
        await self.repo.soft_delete(reply_id)
