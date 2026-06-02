from app.repositories.notifications import NotificationRepository
from app.schemas.notifications import NotificationResponse, NotificationListResponse


class NotificationService:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def list(self, user_id: str, page: int = 1, page_size: int = 20) -> NotificationListResponse:
        items, total = await self.repo.list_by_user(user_id, page=page, page_size=page_size)
        return NotificationListResponse(
            items=[NotificationResponse.model_validate(n) for n in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def mark_read(self, notification_id: str, user_id: str) -> bool:
        return await self.repo.mark_read(notification_id, user_id)

    async def mark_all_read(self, user_id: str) -> int:
        return await self.repo.mark_all_read(user_id)
