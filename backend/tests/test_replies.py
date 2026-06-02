import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_replies_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/discussions/00000000-0000-0000-0000-000000000000/replies")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data


@pytest.mark.asyncio
async def test_create_reply_returns_401_without_auth(client: AsyncClient):
    response = await client.post(
        "/api/v1/discussions/00000000-0000-0000-0000-000000000000/replies",
        json={"content": "Great question! Here are some thoughts."},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_nonexistent_reply_returns_404(client: AsyncClient):
    response = await client.get("/api/v1/replies/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
