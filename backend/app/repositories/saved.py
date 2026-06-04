import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.collection import SavedKnowledge


class SavedKnowledgeRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: str, target_type: str, target_id: str) -> SavedKnowledge:
        sk = SavedKnowledge(
            id=uuid.uuid4(),
            user_id=uuid.UUID(user_id),
            target_type=target_type,
            target_id=uuid.UUID(target_id),
        )
        self.session.add(sk)
        await self.session.flush()
        return sk

    async def list_by_user(self, user_id: str) -> tuple[list[SavedKnowledge], int]:
        conditions = [SavedKnowledge.user_id == uuid.UUID(user_id)]
        count_stmt = select(func.count()).select_from(SavedKnowledge).where(*conditions)
        total = await self.session.scalar(count_stmt) or 0
        stmt = (
            select(SavedKnowledge)
            .where(*conditions)
            .order_by(SavedKnowledge.created_at.desc())
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def list_ids_by_user(self, user_id: str) -> list[dict]:
        stmt = select(SavedKnowledge.target_type, SavedKnowledge.target_id).where(
            SavedKnowledge.user_id == uuid.UUID(user_id)
        )
        result = await self.session.execute(stmt)
        return [{"target_type": t, "target_id": str(tid)} for t, tid in result.all()]

    async def delete(self, user_id: str, target_type: str, target_id: str) -> bool:
        stmt = (
            delete(SavedKnowledge)
            .where(
                SavedKnowledge.user_id == uuid.UUID(user_id),
                SavedKnowledge.target_type == target_type,
                SavedKnowledge.target_id == uuid.UUID(target_id),
            )
        )
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount > 0
