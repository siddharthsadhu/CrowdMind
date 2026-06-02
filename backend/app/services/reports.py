from fastapi import HTTPException, status

from app.repositories.reports import ReportRepository
from app.schemas.reports import ReportCreate, ReportResolve, ReportResponse, ReportListResponse


class ReportService:
    def __init__(self, repo: ReportRepository):
        self.repo = repo

    async def create(self, user_id: str, data: ReportCreate) -> ReportResponse:
        report = await self.repo.create(
            reporter_id=user_id,
            target_type=data.target_type,
            target_id=data.target_id,
            reason=data.reason,
            description=data.description,
        )
        return ReportResponse.model_validate(report)

    async def get_by_id(self, report_id: str) -> ReportResponse:
        report = await self.repo.get_by_id(report_id)
        if not report:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        return ReportResponse.model_validate(report)

    async def list(self, page: int = 1, page_size: int = 20, status: str | None = None) -> ReportListResponse:
        items, total = await self.repo.list(page=page, page_size=page_size, status=status)
        return ReportListResponse(
            items=[ReportResponse.model_validate(r) for r in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def resolve(self, report_id: str, data: ReportResolve) -> ReportResponse:
        report = await self.repo.resolve(report_id, data.status)
        if not report:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        return ReportResponse.model_validate(report)
