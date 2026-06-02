import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_reports_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/reports")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data


@pytest.mark.asyncio
async def test_create_report_returns_401_without_auth(client: AsyncClient):
    response = await client.post(
        "/api/v1/reports",
        json={"target_type": "discussion", "target_id": "00000000-0000-0000-0000-000000000000", "reason": "Spam"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_nonexistent_report_returns_404(client: AsyncClient):
    response = await client.get("/api/v1/reports/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
