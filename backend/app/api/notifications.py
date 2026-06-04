from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_current_user
from app.core.uuid_utils import parse_uuid
from app.models.user import User
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
    filter: str = Query("all", pattern="^(all|unread|archived)$"),
    user: User = Depends(require_current_user),
    service: NotificationService = Depends(get_service),
):
    return await service.list(str(user.id), page=page, page_size=page_size, filter=filter)


@router.patch("/{notification_id}/read", status_code=204)
async def mark_read(
    notification_id: str,
    user: User = Depends(require_current_user),
    service: NotificationService = Depends(get_service),
):
    parse_uuid(notification_id, "notification_id")
    await service.mark_read(notification_id, str(user.id))


@router.patch("/read-all", status_code=204)
async def mark_all_read(
    user: User = Depends(require_current_user),
    service: NotificationService = Depends(get_service),
):
    await service.mark_all_read(str(user.id))


@router.patch("/{notification_id}/archive", status_code=204)
async def archive_notification(
    notification_id: str,
    user: User = Depends(require_current_user),
    service: NotificationService = Depends(get_service),
):
    parse_uuid(notification_id, "notification_id")
    await service.archive(notification_id, str(user.id))


@router.patch("/{notification_id}/unarchive", status_code=204)
async def unarchive_notification(
    notification_id: str,
    user: User = Depends(require_current_user),
    service: NotificationService = Depends(get_service),
):
    parse_uuid(notification_id, "notification_id")
    await service.unarchive(notification_id, str(user.id))


@router.delete("/{notification_id}", status_code=204)
async def delete_notification(
    notification_id: str,
    user: User = Depends(require_current_user),
    service: NotificationService = Depends(get_service),
):
    parse_uuid(notification_id, "notification_id")
    await service.delete(notification_id, str(user.id))
