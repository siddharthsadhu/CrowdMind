import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_candidates_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/faqs/candidates")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data


@pytest.mark.asyncio
async def test_list_faqs_returns_200(client: AsyncClient):
    response = await client.get("/api/v1/faqs")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data


@pytest.mark.asyncio
async def test_get_nonexistent_candidate_returns_404(client: AsyncClient):
    response = await client.get("/api/v1/faqs/candidates/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_nonexistent_faq_returns_404(client: AsyncClient):
    response = await client.get("/api/v1/faqs/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
