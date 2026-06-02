from fastapi import HTTPException, status

from app.repositories.questions import QuestionRepository
from app.schemas.questions import QuestionCreate, QuestionUpdate, QuestionResponse, QuestionListResponse


class QuestionService:
    def __init__(self, repo: QuestionRepository):
        self.repo = repo

    async def create(self, user_id: str, data: QuestionCreate) -> QuestionResponse:
        question = await self.repo.create(
            user_id=user_id,
            title=data.title,
            description=data.description,
            category_id=data.category_id,
        )
        return QuestionResponse.model_validate(question)

    async def get_by_id(self, question_id: str) -> QuestionResponse:
        question = await self.repo.get_by_id(question_id)
        if not question:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
        return QuestionResponse.model_validate(question)

    async def list(
        self,
        page: int = 1,
        page_size: int = 20,
        category_id: str | None = None,
        status: str | None = None,
    ) -> QuestionListResponse:
        items, total = await self.repo.list(
            page=page,
            page_size=page_size,
            category_id=category_id,
            status=status,
        )
        return QuestionListResponse(
            items=[QuestionResponse.model_validate(q) for q in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def update(self, question_id: str, data: QuestionUpdate, user_id: str) -> QuestionResponse:
        question = await self.repo.get_by_id(question_id)
        if not question:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
        if str(question.user_id) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this question")
        update_data = {k: v for k, v in data.model_dump(exclude_none=True).items()}
        updated = await self.repo.update(question_id, update_data)
        return QuestionResponse.model_validate(updated)

    async def delete(self, question_id: str, user_id: str) -> None:
        question = await self.repo.get_by_id(question_id)
        if not question:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
        if str(question.user_id) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this question")
        await self.repo.soft_delete(question_id)
