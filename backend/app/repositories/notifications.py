import uuid

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification


class NotificationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_by_user(self, user_id: str, page: int = 1, page_size: int = 20) -> tuple[list[Notification], int]:
        conditions = [Notification.user_id == uuid.UUID(user_id)]
        count_stmt = select(func.count()).select_from(Notification).where(*conditions)
        total = await self.session.scalar(count_stmt) or 0
        offset = (page - 1) * page_size
        stmt = (
            select(Notification)
            .where(*conditions)
            .order_by(Notification.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def mark_read(self, notification_id: str, user_id: str) -> bool:
        stmt = (
            update(Notification)
            .where(Notification.id == uuid.UUID(notification_id), Notification.user_id == uuid.UUID(user_id))
            .values(is_read=True)
        )
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount > 0

    async def mark_all_read(self, user_id: str) -> int:
        stmt = (
            update(Notification)
            .where(Notification.user_id == uuid.UUID(user_id), Notification.is_read == False)
            .values(is_read=True)
        )
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount
