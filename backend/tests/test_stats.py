import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_dashboard_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data


@pytest.mark.asyncio
async def test_get_stats_summary_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/stats/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_faqs" in data
    assert "total_discussions" in data
    assert "total_users" in data
    assert "total_questions" in data
    assert "resolved_discussions" in data
    assert "resolution_rate" in data
    assert isinstance(data["total_faqs"], int)
    assert data["total_faqs"] >= 0
    assert data["total_users"] >= 0
    assert data["resolution_rate"] >= 0


@pytest.mark.asyncio
async def test_get_trending_faqs_returns_items(client: AsyncClient):
    response = await client.get("/api/v1/stats/trending-faqs?limit=4")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) <= 4
    if len(data["items"]) > 0:
        first = data["items"][0]
        assert "id" in first
        assert "slug" in first
        assert "title" in first


@pytest.mark.asyncio
async def test_get_trending_faqs_limit_bounds(client: AsyncClient):
    """limit must be between 1 and 20 (Pydantic validation)."""
    r0 = await client.get("/api/v1/stats/trending-faqs?limit=0")
    assert r0.status_code == 422
    r100 = await client.get("/api/v1/stats/trending-faqs?limit=100")
    assert r100.status_code == 422
    r5 = await client.get("/api/v1/stats/trending-faqs?limit=5")
    assert r5.status_code == 200
