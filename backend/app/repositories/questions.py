import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func, delete as sa_delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.question import Question


class QuestionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: str, title: str, description: str | None, category_id: str | None) -> Question:
        question = Question(
            id=uuid.uuid4(),
            user_id=uuid.UUID(user_id),
            title=title,
            description=description,
            category_id=uuid.UUID(category_id) if category_id else None,
        )
        self.session.add(question)
        await self.session.flush()
        return question

    async def get_by_id(self, question_id: str) -> Question | None:
        stmt = select(Question).where(
            Question.id == uuid.UUID(question_id),
            Question.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list(
        self,
        page: int = 1,
        page_size: int = 20,
        category_id: str | None = None,
        status: str | None = None,
    ) -> tuple[list[Question], int]:
        conditions = [Question.deleted_at.is_(None)]
        if category_id:
            conditions.append(Question.category_id == uuid.UUID(category_id))
        if status:
            conditions.append(Question.status == status)

        count_stmt = select(func.count()).select_from(Question).where(*conditions)
        total = await self.session.scalar(count_stmt) or 0

        offset = (page - 1) * page_size
        stmt = (
            select(Question)
            .where(*conditions)
            .order_by(Question.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def update(self, question_id: str, data: dict) -> Question | None:
        question = await self.get_by_id(question_id)
        if not question:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(question, key, value)
        question.updated_at = datetime.now(timezone.utc)
        await self.session.flush()
        return question

    async def soft_delete(self, question_id: str) -> bool:
        question = await self.get_by_id(question_id)
        if not question:
            return False
        question.deleted_at = datetime.now(timezone.utc)
        await self.session.flush()
        return True
