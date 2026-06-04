from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth
from app.core.uuid_utils import parse_uuid
from app.repositories.replies import ReplyRepository
from app.services.replies import ReplyService
from app.schemas.replies import ReplyCreate, ReplyUpdate, ReplyResponse, ReplyListResponse

router = APIRouter(prefix="/api/v1/discussions/{discussion_id}/replies", tags=["replies"])

# Also register under /api/v1/replies for direct access
direct_router = APIRouter(prefix="/api/v1/replies", tags=["replies"])


def get_service(db: AsyncSession = Depends(get_db)) -> ReplyService:
    return ReplyService(ReplyRepository(db))


@router.post("", response_model=ReplyResponse, status_code=201)
async def create_reply(
    discussion_id: str,
    data: ReplyCreate,
    user_id: str = Depends(require_auth),
    service: ReplyService = Depends(get_service),
):
    return await service.create(discussion_id, user_id, data)


@router.get("", response_model=ReplyListResponse)
async def list_replies(
    discussion_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    service: ReplyService = Depends(get_service),
):
    return await service.list_by_discussion(discussion_id, page=page, page_size=page_size)


@direct_router.get("/{reply_id}", response_model=ReplyResponse)
async def get_reply(
    reply_id: str,
    service: ReplyService = Depends(get_service),
):
    parse_uuid(reply_id, "reply_id")
    return await service.get_by_id(reply_id)


@direct_router.patch("/{reply_id}", response_model=ReplyResponse)
async def update_reply(
    reply_id: str,
    data: ReplyUpdate,
    user_id: str = Depends(require_auth),
    service: ReplyService = Depends(get_service),
):
    parse_uuid(reply_id, "reply_id")
    return await service.update(reply_id, data, user_id)


@direct_router.delete("/{reply_id}", status_code=204)
async def delete_reply(
    reply_id: str,
    user_id: str = Depends(require_auth),
    service: ReplyService = Depends(get_service),
):
    parse_uuid(reply_id, "reply_id")
    await service.delete(reply_id, user_id)
