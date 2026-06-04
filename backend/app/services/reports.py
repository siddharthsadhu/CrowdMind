from datetime import datetime, timezone
from fastapi import HTTPException, status

from app.repositories.reports import ReportRepository
from app.schemas.reports import (
    ReportCreate, ReportResolve, ReportResponse, ReportListResponse,
    ReportActionRequest, ModerationActionResponse,
)


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

    async def resolve(self, report_id: str, data: ReportResolve, user_id: str | None = None) -> ReportResponse:
        report = await self.repo.resolve(
            report_id,
            data.status,
            action_taken=data.action,
            resolution_notes=data.resolution_notes,
            resolved_by=user_id,
        )
        if not report:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        return ReportResponse.model_validate(report)

    async def apply_action(self, report_id: str, data: ReportActionRequest, moderator_id: str) -> ModerationActionResponse:
        report = await self.repo.get_by_id(report_id)
        if not report:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        if data.action == "NO_ACTION":
            action = await self.repo.create_moderation_action(
                report_id=report_id,
                target_user_id=str(report.reporter_id),
                moderator_id=moderator_id,
                action_type="NO_ACTION",
                action_reason=data.notes,
            )
        else:
            action = await self.repo.create_moderation_action(
                report_id=report_id,
                target_user_id=str(report.reporter_id),
                moderator_id=moderator_id,
                action_type=data.action,
                action_reason=data.notes,
            )
            await self.repo.resolve(
                report_id,
                "RESOLVED",
                action_taken=data.action,
                resolution_notes=data.notes,
                resolved_by=moderator_id,
            )
        return ModerationActionResponse.model_validate(action)
