from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_current_user
from app.core.uuid_utils import parse_uuid
from app.models.user import User
from app.repositories.saved import SavedKnowledgeRepository
from app.services.saved import SavedKnowledgeService
from app.schemas.saved import SavedCreate, SavedResponse, SavedListResponse, SavedIdItem

router = APIRouter(prefix="/api/v1/saved", tags=["saved"])


def get_service(db: AsyncSession = Depends(get_db)) -> SavedKnowledgeService:
    return SavedKnowledgeService(SavedKnowledgeRepository(db))


@router.get("", response_model=SavedListResponse)
async def list_saved(
    user: User = Depends(require_current_user),
    service: SavedKnowledgeService = Depends(get_service),
):
    return await service.list_saved(str(user.id))


@router.get("/ids", response_model=list[SavedIdItem])
async def list_saved_ids(
    user: User = Depends(require_current_user),
    service: SavedKnowledgeService = Depends(get_service),
):
    return await service.list_ids(str(user.id))


@router.post("", response_model=SavedResponse, status_code=201)
async def create_saved(
    data: SavedCreate,
    user: User = Depends(require_current_user),
    service: SavedKnowledgeService = Depends(get_service),
):
    parse_uuid(data.target_id, "target_id")
    return await service.create(str(user.id), data)


@router.delete("/{target_type}/{target_id}", status_code=204)
async def delete_saved(
    target_type: str,
    target_id: str,
    user: User = Depends(require_current_user),
    service: SavedKnowledgeService = Depends(get_service),
):
    parse_uuid(target_id, "target_id")
    await service.delete(str(user.id), target_type, target_id)
