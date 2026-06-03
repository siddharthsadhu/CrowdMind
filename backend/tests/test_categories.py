import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_categories_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
