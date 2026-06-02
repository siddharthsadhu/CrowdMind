import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.discussion import Reply, Discussion


class ReplyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, discussion_id: str, user_id: str, content: str, parent_reply_id: str | None = None) -> Reply:
        reply = Reply(
            id=uuid.uuid4(),
            discussion_id=uuid.UUID(discussion_id),
            user_id=uuid.UUID(user_id),
            content=content,
            parent_reply_id=uuid.UUID(parent_reply_id) if parent_reply_id else None,
        )
        self.session.add(reply)

        stmt = select(Discussion).where(Discussion.id == uuid.UUID(discussion_id))
        result = await self.session.execute(stmt)
        discussion = result.scalar_one_or_none()
        if discussion:
            discussion.reply_count = (discussion.reply_count or 0) + 1

        await self.session.flush()
        return reply

    async def get_by_id(self, reply_id: str) -> Reply | None:
        stmt = select(Reply).where(
            Reply.id == uuid.UUID(reply_id),
            Reply.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_discussion(
        self,
        discussion_id: str,
        page: int = 1,
        page_size: int = 50,
    ) -> tuple[list[Reply], int]:
        conditions = [
            Reply.discussion_id == uuid.UUID(discussion_id),
            Reply.deleted_at.is_(None),
        ]
        count_stmt = select(func.count()).select_from(Reply).where(*conditions)
        total = await self.session.scalar(count_stmt) or 0

        offset = (page - 1) * page_size
        stmt = (
            select(Reply)
            .where(*conditions)
            .order_by(Reply.created_at.asc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def update(self, reply_id: str, data: dict) -> Reply | None:
        reply = await self.get_by_id(reply_id)
        if not reply:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(reply, key, value)
        reply.updated_at = datetime.now(timezone.utc)
        await self.session.flush()
        return reply

    async def soft_delete(self, reply_id: str) -> bool:
        reply = await self.get_by_id(reply_id)
        if not reply:
            return False
        reply.deleted_at = datetime.now(timezone.utc)

        stmt = select(Discussion).where(Discussion.id == reply.discussion_id)
        result = await self.session.execute(stmt)
        discussion = result.scalar_one_or_none()
        if discussion:
            discussion.reply_count = max(0, (discussion.reply_count or 0) - 1)

        await self.session.flush()
        return True
