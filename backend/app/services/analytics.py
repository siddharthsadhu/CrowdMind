from app.repositories.analytics import AnalyticsRepository
from app.schemas.analytics import DashboardResponse


class AnalyticsService:
    def __init__(self, repo: AnalyticsRepository):
        self.repo = repo

    async def record_event(self, event_name: str, user_id: str | None = None,
                           entity_type: str | None = None, entity_id: str | None = None) -> None:
        await self.repo.record_event(event_name, user_id, entity_type, entity_id)

    async def get_dashboard(self) -> DashboardResponse:
        data = await self.repo.get_dashboard()
        return DashboardResponse(**data)
