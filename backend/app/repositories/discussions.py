import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.discussion import Discussion


class DiscussionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, created_by: str, title: str, description: str | None, question_id: str | None) -> Discussion:
        discussion = Discussion(
            id=uuid.uuid4(),
            created_by=uuid.UUID(created_by),
            title=title,
            description=description,
            question_id=uuid.UUID(question_id) if question_id else None,
        )
        self.session.add(discussion)
        await self.session.flush()
        return discussion

    async def get_by_id(self, discussion_id: str) -> Discussion | None:
        stmt = select(Discussion).where(
            Discussion.id == uuid.UUID(discussion_id),
            Discussion.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list(
        self,
        page: int = 1,
        page_size: int = 20,
        status: str | None = None,
    ) -> tuple[list[Discussion], int]:
        conditions = [Discussion.deleted_at.is_(None)]
        if status:
            conditions.append(Discussion.status == status)

        count_stmt = select(func.count()).select_from(Discussion).where(*conditions)
        total = await self.session.scalar(count_stmt) or 0

        offset = (page - 1) * page_size
        stmt = (
            select(Discussion)
            .where(*conditions)
            .order_by(Discussion.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def update(self, discussion_id: str, data: dict) -> Discussion | None:
        discussion = await self.get_by_id(discussion_id)
        if not discussion:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(discussion, key, value)
        discussion.updated_at = datetime.now(timezone.utc)
        await self.session.flush()
        return discussion

    async def soft_delete(self, discussion_id: str) -> bool:
        discussion = await self.get_by_id(discussion_id)
        if not discussion:
            return False
        discussion.deleted_at = datetime.now(timezone.utc)
        await self.session.flush()
        return True

    async def increment_view_count(self, discussion_id: str) -> None:
        discussion = await self.get_by_id(discussion_id)
        if discussion:
            discussion.view_count = (discussion.view_count or 0) + 1
            await self.session.flush()
