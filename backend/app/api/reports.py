from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth
from app.repositories.reports import ReportRepository
from app.services.reports import ReportService
from app.schemas.reports import ReportCreate, ReportResolve, ReportResponse, ReportListResponse

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])


def get_service(db: AsyncSession = Depends(get_db)) -> ReportService:
    return ReportService(ReportRepository(db))


@router.post("", response_model=ReportResponse, status_code=201)
async def create_report(
    data: ReportCreate,
    user_id: str = Depends(require_auth),
    service: ReportService = Depends(get_service),
):
    return await service.create(user_id, data)


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
    return await service.get_by_id(report_id)


@router.patch("/{report_id}", response_model=ReportResponse)
async def resolve_report(
    report_id: str,
    data: ReportResolve,
    service: ReportService = Depends(get_service),
):
    return await service.resolve(report_id, data)
