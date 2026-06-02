import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_discussions_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/discussions")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data


@pytest.mark.asyncio
async def test_create_discussion_returns_401_without_auth(client: AsyncClient):
    response = await client.post(
        "/api/v1/discussions",
        json={"title": "How can we improve quantitative reasoning skills?"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_nonexistent_discussion_returns_404(client: AsyncClient):
    response = await client.get("/api/v1/discussions/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
