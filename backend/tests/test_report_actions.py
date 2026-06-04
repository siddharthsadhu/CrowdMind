import pytest
import uuid
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.asyncio
async def test_resolve_with_notes(
    client: AsyncClient, test_user: User, test_user_token: str, test_db
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    from app.models.moderation import Report
    report = Report(
        id=uuid.uuid4(),
        reporter_id=test_user.id,
        target_type="FAQ",
        target_id=uuid.uuid4(),
        reason="Test reason",
        description="desc",
    )
    test_db.add(report)
    await test_db.flush()

    resp = await client.patch(
        f"/api/v1/reports/{report.id}",
        headers=headers,
        json={"status": "RESOLVED", "action": "HIDE", "resolution_notes": "Hidden by mod"},
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["status"] == "RESOLVED"
    assert data["action_taken"] == "HIDE"
    assert data["resolution_notes"] == "Hidden by mod"
    assert data["resolved_at"] is not None


@pytest.mark.asyncio
async def test_apply_report_action(
    client: AsyncClient, test_user: User, test_user_token: str, test_db
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    from app.models.moderation import Report
    report = Report(
        id=uuid.uuid4(),
        reporter_id=test_user.id,
        target_type="REPLY",
        target_id=uuid.uuid4(),
        reason="Spam",
    )
    test_db.add(report)
    await test_db.flush()

    resp = await client.post(
        f"/api/v1/reports/{report.id}/actions",
        headers=headers,
        json={"action": "WARN", "notes": "First warning"},
    )
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["action_type"] == "WARN"
    assert data["action_reason"] == "First warning"

    # Verify report is now RESOLVED
    resp = await client.get(f"/api/v1/reports/{report.id}", headers=headers)
    assert resp.status_code == 200
    rdata = resp.json()
    assert rdata["status"] == "RESOLVED"
    assert rdata["action_taken"] == "WARN"


@pytest.mark.asyncio
async def test_apply_report_action_invalid(
    client: AsyncClient, test_user_token: str
):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    resp = await client.post(
        f"/api/v1/reports/{uuid.uuid4()}/actions",
        headers=headers,
        json={"action": "BOGUS", "notes": "x"},
    )
    assert resp.status_code == 422
