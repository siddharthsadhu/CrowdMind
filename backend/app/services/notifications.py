from fastapi import HTTPException, status

from app.repositories.notifications import NotificationRepository
from app.schemas.notifications import NotificationResponse, NotificationListResponse


class NotificationService:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def list(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 20,
        filter: str = "all",
    ) -> NotificationListResponse:
        items, total = await self.repo.list_by_user(user_id, page=page, page_size=page_size, filter=filter)
        return NotificationListResponse(
            items=[NotificationResponse.model_validate(n) for n in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def mark_read(self, notification_id: str, user_id: str) -> bool:
        ok = await self.repo.mark_read(notification_id, user_id)
        if not ok:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        return True

    async def mark_all_read(self, user_id: str) -> int:
        return await self.repo.mark_all_read(user_id)

    async def archive(self, notification_id: str, user_id: str) -> bool:
        ok = await self.repo.archive(notification_id, user_id)
        if not ok:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        return True

    async def unarchive(self, notification_id: str, user_id: str) -> bool:
        ok = await self.repo.unarchive(notification_id, user_id)
        if not ok:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        return True

    async def delete(self, notification_id: str, user_id: str) -> None:
        ok = await self.repo.soft_delete(notification_id, user_id)
        if not ok:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
