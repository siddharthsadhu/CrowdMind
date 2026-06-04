import pytest
import uuid
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.asyncio
async def test_contributions_requires_auth(client: AsyncClient):
    resp = await client.get("/api/v1/users/me/contributions")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_contributions_empty(client: AsyncClient, test_user_token: str):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    resp = await client.get("/api/v1/users/me/contributions", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["summary"]["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio
async def test_contributions_returns_questions(
    client: AsyncClient, test_user: User, test_user_token: str, test_db
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    from app.models.question import Question
    q = Question(
        id=uuid.uuid4(),
        user_id=test_user.id,
        title="How does vector search work?",
        description="Looking for an explanation.",
    )
    test_db.add(q)
    await test_db.flush()

    resp = await client.get("/api/v1/users/me/contributions", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["summary"]["questions"] == 1
    assert data["summary"]["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["type"] == "question"
    assert data["items"][0]["title"] == "How does vector search work?"
