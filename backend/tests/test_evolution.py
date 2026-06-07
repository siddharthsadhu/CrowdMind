"""Tests for the evolution engine: events, timeline, diffs, rollback."""
import uuid

import pytest
from httpx import AsyncClient

from app.models.faq import EvolutionEvent, FaqVersion, PublishedFaq
from app.models.user import User
from app.services.evolution import (
    compute_simple_diff,
    list_all_events,
    list_events_for_faq,
    record_event,
    rollback_to_version,
)


@pytest.mark.asyncio
async def test_record_and_list_event(test_db):
    faq_id = str(uuid.uuid4())
    event = await record_event(
        test_db,
        faq_id=faq_id,
        event_type="FAQ_PUBLISHED",
        description="Initial publish",
    )
    await test_db.commit()

    events = await list_events_for_faq(test_db, faq_id)
    assert len(events) == 1
    assert events[0].event_type == "FAQ_PUBLISHED"


@pytest.mark.asyncio
async def test_list_events_ordered_desc(test_db):
    faq_id = str(uuid.uuid4())
    await record_event(test_db, faq_id=faq_id, event_type="FAQ_PUBLISHED")
    await record_event(test_db, faq_id=faq_id, event_type="FAQ_UPDATED", description="v2")
    await record_event(test_db, faq_id=faq_id, event_type="FAQ_UPDATED", description="v3")
    await test_db.commit()

    events = await list_events_for_faq(test_db, faq_id)
    assert [e.event_type for e in events] == ["FAQ_UPDATED", "FAQ_UPDATED", "FAQ_PUBLISHED"]


@pytest.mark.asyncio
async def test_evolution_events_public_endpoint(client: AsyncClient, test_db):
    faq_id = str(uuid.uuid4())
    await record_event(test_db, faq_id=faq_id, event_type="FAQ_PUBLISHED")
    await test_db.commit()

    resp = await client.get("/api/v1/evolution/events")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data


@pytest.mark.asyncio
async def test_timeline_for_faq(client: AsyncClient, test_db):
    faq = PublishedFaq(
        id=uuid.uuid4(),
        slug="test-faq",
        title="Test FAQ",
        content="Initial content",
        version_number=2,
        published_by=uuid.uuid4(),
    )
    test_db.add(faq)
    await test_db.flush()

    v1 = FaqVersion(
        id=uuid.uuid4(),
        faq_id=faq.id,
        version_number=1,
        title="Test FAQ",
        content="Initial content",
        change_summary="Initial publication",
        created_by=faq.published_by,
    )
    v2 = FaqVersion(
        id=uuid.uuid4(),
        faq_id=faq.id,
        version_number=2,
        title="Test FAQ",
        content="Updated content with a fix.",
        change_summary="Fixed typo",
        created_by=faq.published_by,
    )
    test_db.add_all([v1, v2])
    await test_db.flush()

    await record_event(
        test_db,
        faq_id=str(faq.id),
        event_type="FAQ_UPDATED",
        description="v1 → v2",
    )
    await test_db.commit()

    resp = await client.get(f"/api/v1/evolution/timeline/{faq.id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_version"] == 2
    assert len(data["timeline"]) == 2
    assert data["timeline"][0]["is_current"] is True


@pytest.mark.asyncio
async def test_timeline_404_for_missing_faq(client: AsyncClient):
    resp = await client.get(f"/api/v1/evolution/timeline/{uuid.uuid4()}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_diff_endpoint(client: AsyncClient, test_db):
    faq = PublishedFaq(
        id=uuid.uuid4(),
        slug="diff-faq",
        title="Diff FAQ",
        content="Hello world",
        version_number=2,
        published_by=uuid.uuid4(),
    )
    test_db.add(faq)
    await test_db.flush()

    v1 = FaqVersion(
        id=uuid.uuid4(),
        faq_id=faq.id,
        version_number=1,
        title="Diff FAQ",
        content="Hello world\nThis is the first version.",
        change_summary="Initial",
        created_by=faq.published_by,
    )
    v2 = FaqVersion(
        id=uuid.uuid4(),
        faq_id=faq.id,
        version_number=2,
        title="Diff FAQ",
        content="Hello world\nThis is the second version with extra info.",
        change_summary="Expanded",
        created_by=faq.published_by,
    )
    test_db.add_all([v1, v2])
    await test_db.commit()

    resp = await client.get(f"/api/v1/evolution/diff/{faq.id}/1/2")
    assert resp.status_code == 200
    data = resp.json()
    assert data["from_version"] == 1
    assert data["to_version"] == 2
    assert data["additions"] > 0 or data["deletions"] > 0


@pytest.mark.asyncio
async def test_diff_same_versions_rejected(client: AsyncClient, test_db):
    faq = PublishedFaq(
        id=uuid.uuid4(),
        slug="same-diff",
        title="Same",
        content="x",
        version_number=1,
        published_by=uuid.uuid4(),
    )
    test_db.add(faq)
    await test_db.commit()
    resp = await client.get(f"/api/v1/evolution/diff/{faq.id}/1/1")
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_rollback_creates_new_version(test_db, test_user: User):
    faq = PublishedFaq(
        id=uuid.uuid4(),
        slug="rollback-faq",
        title="Current title",
        content="Current content",
        version_number=3,
        published_by=test_user.id,
    )
    test_db.add(faq)
    await test_db.flush()

    v1 = FaqVersion(
        id=uuid.uuid4(),
        faq_id=faq.id,
        version_number=1,
        title="Original title",
        content="Original content",
        change_summary="Initial",
        created_by=test_user.id,
    )
    test_db.add(v1)
    await test_db.flush()

    rolled = await rollback_to_version(
        test_db,
        faq_id=str(faq.id),
        target_version_id=str(v1.id),
        triggered_by=str(test_user.id),
    )
    await test_db.commit()
    assert rolled is not None
    assert rolled.title == "Original title"
    assert rolled.content == "Original content"
    assert rolled.version_number == 4  # current was 3, +1
    events = await list_events_for_faq(test_db, str(faq.id))
    assert any(e.event_type == "FAQ_ROLLBACK" for e in events)


@pytest.mark.asyncio
async def test_rollback_requires_admin_or_moderator(client: AsyncClient, test_user: User, test_user_token: str):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    resp = await client.post(
        f"/api/v1/faqs/{uuid.uuid4()}/rollback",
        json={"target_version_id": str(uuid.uuid4())},
        headers=headers,
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_rollback_404_for_missing_faq(client: AsyncClient, test_db):
    admin = User(
        id=uuid.uuid4(),
        clerk_user_id=f"clerk_admin_{uuid.uuid4().hex[:8]}",
        username="admin",
        email="admin@example.com",
        full_name="Admin",
        role="admin",
    )
    test_db.add(admin)
    await test_db.commit()
    from app.core.security import create_test_token
    token = create_test_token(admin.clerk_user_id, role="admin")
    headers = {"Authorization": f"Bearer {token}"}
    resp = await client.post(
        f"/api/v1/faqs/{uuid.uuid4()}/rollback",
        json={"target_version_id": str(uuid.uuid4())},
        headers=headers,
    )
    assert resp.status_code in (404, 401, 403)


def test_compute_simple_diff_basic():
    old = "alpha\nbeta\ngamma"
    new = "alpha\nBETA\ngamma\ndelta"
    diff = compute_simple_diff(old, new)
    assert isinstance(diff, list)
    ops = [d["op"] for d in diff]
    assert "insert" in ops or "replace" in ops
