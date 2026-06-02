from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth
from app.repositories.notifications import NotificationRepository
from app.services.notifications import NotificationService
from app.schemas.notifications import NotificationResponse, NotificationListResponse

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])


def get_service(db: AsyncSession = Depends(get_db)) -> NotificationService:
    return NotificationService(NotificationRepository(db))


@router.get("", response_model=NotificationListResponse)
async def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: str = Depends(require_auth),
    service: NotificationService = Depends(get_service),
):
    return await service.list(user_id, page=page, page_size=page_size)


@router.patch("/{notification_id}/read", status_code=204)
async def mark_read(
    notification_id: str,
    user_id: str = Depends(require_auth),
    service: NotificationService = Depends(get_service),
):
    await service.mark_read(notification_id, user_id)


@router.patch("/read-all", status_code=204)
async def mark_all_read(
    user_id: str = Depends(require_auth),
    service: NotificationService = Depends(get_service),
):
    await service.mark_all_read(user_id)
