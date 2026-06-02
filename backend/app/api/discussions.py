from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth, get_optional_user
from app.repositories.discussions import DiscussionRepository
from app.services.discussions import DiscussionService
from app.schemas.discussions import DiscussionCreate, DiscussionUpdate, DiscussionResponse, DiscussionListResponse

router = APIRouter(prefix="/api/v1/discussions", tags=["discussions"])


def get_service(db: AsyncSession = Depends(get_db)) -> DiscussionService:
    return DiscussionService(DiscussionRepository(db))


@router.post("", response_model=DiscussionResponse, status_code=201)
async def create_discussion(
    data: DiscussionCreate,
    user_id: str = Depends(require_auth),
    service: DiscussionService = Depends(get_service),
):
    return await service.create(user_id, data)


@router.get("", response_model=DiscussionListResponse)
async def list_discussions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = None,
    service: DiscussionService = Depends(get_service),
):
    return await service.list(page=page, page_size=page_size, status=status)


@router.get("/{discussion_id}", response_model=DiscussionResponse)
async def get_discussion(
    discussion_id: str,
    service: DiscussionService = Depends(get_service),
):
    return await service.get_by_id(discussion_id)


@router.patch("/{discussion_id}", response_model=DiscussionResponse)
async def update_discussion(
    discussion_id: str,
    data: DiscussionUpdate,
    user_id: str = Depends(require_auth),
    service: DiscussionService = Depends(get_service),
):
    return await service.update(discussion_id, data, user_id)


@router.delete("/{discussion_id}", status_code=204)
async def delete_discussion(
    discussion_id: str,
    user_id: str = Depends(require_auth),
    service: DiscussionService = Depends(get_service),
):
    await service.delete(discussion_id, user_id)
