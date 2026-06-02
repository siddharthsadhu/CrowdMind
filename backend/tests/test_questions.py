import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_questions_returns_200_without_auth(client: AsyncClient):
    response = await client.get("/api/v1/questions")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_create_question_returns_401_without_auth(client: AsyncClient):
    response = await client.post("/api/v1/questions", json={"title": "Test question?"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_nonexistent_question_returns_404(client: AsyncClient):
    response = await client.get("/api/v1/questions/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
