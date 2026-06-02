import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.moderation import Report


class ReportRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, reporter_id: str, target_type: str, target_id: str, reason: str, description: str | None = None) -> Report:
        report = Report(
            id=uuid.uuid4(),
            reporter_id=uuid.UUID(reporter_id),
            target_type=target_type,
            target_id=uuid.UUID(target_id),
            reason=reason,
            description=description,
        )
        self.session.add(report)
        await self.session.flush()
        return report

    async def get_by_id(self, report_id: str) -> Report | None:
        stmt = select(Report).where(Report.id == uuid.UUID(report_id))
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list(
        self,
        page: int = 1,
        page_size: int = 20,
        status: str | None = None,
    ) -> tuple[list[Report], int]:
        conditions = []
        if status:
            conditions.append(Report.status == status)
        count_stmt = select(func.count()).select_from(Report).where(*conditions)
        total = await self.session.scalar(count_stmt) or 0
        offset = (page - 1) * page_size
        stmt = (
            select(Report)
            .where(*conditions)
            .order_by(Report.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def resolve(self, report_id: str, status: str) -> Report | None:
        report = await self.get_by_id(report_id)
        if not report:
            return None
        report.status = status
        report.updated_at = datetime.now(timezone.utc)
        await self.session.flush()
        return report
