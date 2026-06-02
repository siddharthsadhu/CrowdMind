import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_vote_returns_401_without_auth(client: AsyncClient):
    response = await client.post(
        "/api/v1/votes",
        json={"target_type": "discussion", "target_id": "00000000-0000-0000-0000-000000000000", "vote_type": "UPVOTE"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_remove_vote_returns_401_without_auth(client: AsyncClient):
    response = await client.delete("/api/v1/votes/discussion/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 401
