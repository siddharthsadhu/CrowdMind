import pytest
import uuid
from httpx import AsyncClient

from app.models.discussion import Discussion, Reply
from app.models.user import User


@pytest.mark.asyncio
async def test_accept_reply_requires_auth(client: AsyncClient):
    resp = await client.patch(
        f"/api/v1/discussions/{uuid.uuid4()}/accept-reply",
        json={"reply_id": str(uuid.uuid4())},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_accept_reply_invalid_discussion_id(client: AsyncClient, test_user_token: str):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    resp = await client.patch(
        "/api/v1/discussions/not-a-uuid/accept-reply",
        headers=headers,
        json={"reply_id": str(uuid.uuid4())},
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_accept_reply_invalid_reply_id(client: AsyncClient, test_user_token: str):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    resp = await client.patch(
        f"/api/v1/discussions/{uuid.uuid4()}/accept-reply",
        headers=headers,
        json={"reply_id": "not-a-uuid"},
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_accept_reply_full_flow(client: AsyncClient, test_user: User, test_user_token: str, test_db):
    headers = {"Authorization": f"Bearer {test_user_token}"}

    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="Test discussion for accept",
    )
    test_db.add(discussion)
    await test_db.flush()

    reply = Reply(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        user_id=test_user.id,
        content="Test reply",
    )
    test_db.add(reply)
    await test_db.flush()

    resp = await client.patch(
        f"/api/v1/discussions/{discussion.id}/accept-reply",
        headers=headers,
        json={"reply_id": str(reply.id)},
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["status"] == "ANSWERED"

    await test_db.refresh(reply)
    assert reply.is_accepted is True


@pytest.mark.asyncio
async def test_accept_reply_forbidden_for_non_creator(
    client: AsyncClient, test_user: User, test_user_token: str, test_db
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    other_user_id = uuid.uuid4()
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=other_user_id,
        title="Foreign discussion",
    )
    test_db.add(discussion)
    await test_db.flush()
    reply = Reply(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        user_id=test_user.id,
        content="My reply",
    )
    test_db.add(reply)
    await test_db.flush()

    resp = await client.patch(
        f"/api/v1/discussions/{discussion.id}/accept-reply",
        headers=headers,
        json={"reply_id": str(reply.id)},
    )
    assert resp.status_code == 403
