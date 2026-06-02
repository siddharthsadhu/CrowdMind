from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth, get_optional_user
from app.repositories.questions import QuestionRepository
from app.services.questions import QuestionService
from app.schemas.questions import QuestionCreate, QuestionUpdate, QuestionResponse, QuestionListResponse

router = APIRouter(prefix="/api/v1/questions", tags=["questions"])


def get_service(db: AsyncSession = Depends(get_db)) -> QuestionService:
    return QuestionService(QuestionRepository(db))


@router.post("", response_model=QuestionResponse, status_code=201)
async def create_question(
    data: QuestionCreate,
    user_id: str = Depends(require_auth),
    service: QuestionService = Depends(get_service),
):
    return await service.create(user_id, data)


@router.get("", response_model=QuestionListResponse)
async def list_questions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: str | None = None,
    status: str | None = None,
    service: QuestionService = Depends(get_service),
):
    return await service.list(page=page, page_size=page_size, category_id=category_id, status=status)


@router.get("/{question_id}", response_model=QuestionResponse)
async def get_question(
    question_id: str,
    service: QuestionService = Depends(get_service),
):
    return await service.get_by_id(question_id)


@router.patch("/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: str,
    data: QuestionUpdate,
    user_id: str = Depends(require_auth),
    service: QuestionService = Depends(get_service),
):
    return await service.update(question_id, data, user_id)


@router.delete("/{question_id}", status_code=204)
async def delete_question(
    question_id: str,
    user_id: str = Depends(require_auth),
    service: QuestionService = Depends(get_service),
):
    await service.delete(question_id, user_id)
