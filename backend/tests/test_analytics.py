import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_dashboard_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
