import pytest
import uuid
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.asyncio
async def test_archive_notification(
    client: AsyncClient, test_user: User, test_user_token: str, test_db
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    from app.models.notification import Notification
    n = Notification(
        id=uuid.uuid4(),
        user_id=test_user.id,
        notif_type="INFO",
        title="Test notification",
        message="body",
    )
    test_db.add(n)
    await test_db.flush()

    resp = await client.patch(f"/api/v1/notifications/{n.id}/archive", headers=headers)
    assert resp.status_code == 204

    await test_db.refresh(n)
    assert n.is_archived is True


@pytest.mark.asyncio
async def test_unarchive_notification(
    client: AsyncClient, test_user: User, test_user_token: str, test_db
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    from app.models.notification import Notification
    n = Notification(
        id=uuid.uuid4(),
        user_id=test_user.id,
        notif_type="INFO",
        title="Test",
        is_archived=True,
    )
    test_db.add(n)
    await test_db.flush()

    resp = await client.patch(f"/api/v1/notifications/{n.id}/unarchive", headers=headers)
    assert resp.status_code == 204
    await test_db.refresh(n)
    assert n.is_archived is False


@pytest.mark.asyncio
async def test_delete_notification(
    client: AsyncClient, test_user: User, test_user_token: str, test_db
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    from app.models.notification import Notification
    n = Notification(
        id=uuid.uuid4(),
        user_id=test_user.id,
        notif_type="INFO",
        title="Test",
    )
    test_db.add(n)
    await test_db.flush()

    resp = await client.delete(f"/api/v1/notifications/{n.id}", headers=headers)
    assert resp.status_code == 204
    await test_db.refresh(n)
    assert n.deleted_at is not None


@pytest.mark.asyncio
async def test_list_archived_filter(
    client: AsyncClient, test_user: User, test_user_token: str, test_db
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    from app.models.notification import Notification
    n1 = Notification(
        id=uuid.uuid4(), user_id=test_user.id, notif_type="INFO", title="Active"
    )
    n2 = Notification(
        id=uuid.uuid4(),
        user_id=test_user.id,
        notif_type="INFO",
        title="Archived",
        is_archived=True,
    )
    test_db.add_all([n1, n2])
    await test_db.flush()

    # All (default) - should only see n1
    resp = await client.get("/api/v1/notifications", headers=headers)
    assert resp.status_code == 200
    items = resp.json()["items"]
    assert len(items) == 1
    assert items[0]["id"] == str(n1.id)

    # Filter archived
    resp = await client.get("/api/v1/notifications?filter=archived", headers=headers)
    assert resp.status_code == 200
    items = resp.json()["items"]
    assert len(items) == 1
    assert items[0]["id"] == str(n2.id)
