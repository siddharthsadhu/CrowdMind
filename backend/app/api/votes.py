from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth
from app.repositories.votes import VoteRepository
from app.services.votes import VoteService
from app.schemas.votes import VoteCreate, VoteResponse

router = APIRouter(prefix="/api/v1/votes", tags=["votes"])


def get_service(db: AsyncSession = Depends(get_db)) -> VoteService:
    return VoteService(VoteRepository(db))


@router.post("", response_model=VoteResponse, status_code=201)
async def create_or_update_vote(
    data: VoteCreate,
    user_id: str = Depends(require_auth),
    service: VoteService = Depends(get_service),
):
    return await service.create_or_update(user_id, data)


@router.delete("/{target_type}/{target_id}", status_code=204)
async def remove_vote(
    target_type: str,
    target_id: str,
    user_id: str = Depends(require_auth),
    service: VoteService = Depends(get_service),
):
    await service.remove(user_id, target_type, target_id)
