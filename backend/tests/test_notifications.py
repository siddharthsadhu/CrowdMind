import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_notifications_returns_401_without_auth(client: AsyncClient):
    response = await client.get("/api/v1/notifications")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_mark_read_returns_401_without_auth(client: AsyncClient):
    response = await client.patch("/api/v1/notifications/00000000-0000-0000-0000-000000000000/read")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_mark_all_read_returns_401_without_auth(client: AsyncClient):
    response = await client.patch("/api/v1/notifications/read-all")
    assert response.status_code == 401
