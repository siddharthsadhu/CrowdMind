from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_optional_user
from app.repositories.analytics import AnalyticsRepository
from app.services.analytics import AnalyticsService
from app.schemas.analytics import AnalyticsEventCreate, DashboardResponse

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


def get_service(db: AsyncSession = Depends(get_db)) -> AnalyticsService:
    return AnalyticsService(AnalyticsRepository(db))


@router.post("/events", status_code=204)
async def record_event(
    data: AnalyticsEventCreate,
    user_id: str | None = Depends(get_optional_user),
    service: AnalyticsService = Depends(get_service),
):
    await service.record_event(
        event_name=data.event_name,
        user_id=user_id,
        entity_type=data.entity_type,
        entity_id=data.entity_id,
    )


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    service: AnalyticsService = Depends(get_service),
):
    return await service.get_dashboard()
