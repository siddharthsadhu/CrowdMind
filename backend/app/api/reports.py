from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth, require_current_user
from app.core.uuid_utils import parse_uuid
from app.models.user import User
from app.repositories.reports import ReportRepository
from app.services.reports import ReportService
from app.schemas.reports import (
    ReportCreate, ReportResolve, ReportResponse, ReportListResponse,
    ReportActionRequest, ModerationActionResponse,
)

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])


def get_service(db: AsyncSession = Depends(get_db)) -> ReportService:
    return ReportService(ReportRepository(db))


@router.post("", response_model=ReportResponse, status_code=201)
async def create_report(
    data: ReportCreate,
    user: User = Depends(require_current_user),
    service: ReportService = Depends(get_service),
):
    parse_uuid(data.target_id, "target_id")
    return await service.create(str(user.id), data)


@router.get("", response_model=ReportListResponse)
async def list_reports(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = None,
    service: ReportService = Depends(get_service),
):
    return await service.list(page=page, page_size=page_size, status=status)


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: str,
    service: ReportService = Depends(get_service),
):
    parse_uuid(report_id, "report_id")
    return await service.get_by_id(report_id)


@router.patch("/{report_id}", response_model=ReportResponse)
async def resolve_report(
    report_id: str,
    data: ReportResolve,
    user: User = Depends(require_current_user),
    service: ReportService = Depends(get_service),
):
    parse_uuid(report_id, "report_id")
    return await service.resolve(report_id, data, user_id=str(user.id))


@router.post("/{report_id}/actions", response_model=ModerationActionResponse, status_code=201)
async def apply_report_action(
    report_id: str,
    data: ReportActionRequest,
    user: User = Depends(require_current_user),
    service: ReportService = Depends(get_service),
):
    parse_uuid(report_id, "report_id")
    return await service.apply_action(report_id, data, moderator_id=str(user.id))
