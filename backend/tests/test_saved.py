import pytest
from httpx import AsyncClient

from app.models.faq import PublishedFaq
from app.models.user import User


@pytest.mark.asyncio
async def test_create_list_delete_saved(client: AsyncClient, test_user: User, test_user_token: str, test_db):
    headers = {"Authorization": f"Bearer {test_user_token}"}

    faq = PublishedFaq(slug="test-saved-faq", title="Test Saved FAQ", content="body", published_by=test_user.id)
    test_db.add(faq)
    await test_db.flush()

    resp = await client.post(
        "/api/v1/saved",
        headers=headers,
        json={"target_type": "FAQ", "target_id": str(faq.id)},
    )
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["target_type"] == "FAQ"
    assert data["target_id"] == str(faq.id)

    resp = await client.get("/api/v1/saved", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["total"] == 1
    assert len(resp.json()["items"]) == 1

    resp = await client.get("/api/v1/saved/ids", headers=headers)
    assert resp.status_code == 200
    ids = resp.json()
    assert len(ids) == 1
    assert ids[0]["target_type"] == "FAQ"

    resp = await client.delete(f"/api/v1/saved/FAQ/{faq.id}", headers=headers)
    assert resp.status_code == 204

    resp = await client.get("/api/v1/saved", headers=headers)
    assert resp.json()["total"] == 0


@pytest.mark.asyncio
async def test_create_saved_invalid_uuid(client: AsyncClient, test_user_token: str):
    headers = {"Authorization": f"Bearer {test_user_token}"}

    resp = await client.post(
        "/api/v1/saved",
        headers=headers,
        json={"target_type": "FAQ", "target_id": "not-a-uuid"},
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_create_saved_invalid_type(client: AsyncClient, test_user_token: str):
    headers = {"Authorization": f"Bearer {test_user_token}"}

    resp = await client.post(
        "/api/v1/saved",
        headers=headers,
        json={"target_type": "INVALID", "target_id": "5f3e9fb8-8781-4cce-b720-d825c20544bd"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_saved_requires_auth(client: AsyncClient):
    resp = await client.get("/api/v1/saved")
    assert resp.status_code == 401
    resp = await client.post(
        "/api/v1/saved",
        json={"target_type": "FAQ", "target_id": "5f3e9fb8-8781-4cce-b720-d825c20544bd"},
    )
    assert resp.status_code == 401
