"""Tests for the question analysis cache: ?force=true bypass + admin flush."""
import os
import json
import uuid

import pytest
from httpx import AsyncClient
from unittest.mock import patch

from app.models.question import Question
from app.models.user import User


@pytest.mark.asyncio
async def test_force_query_param_bypasses_cache(client: AsyncClient, test_db, test_user: User):
    q = Question(
        id=uuid.uuid4(),
        user_id=test_user.id,
        title="What is the meaning of life?",
        description="42",
    )
    test_db.add(q)
    await test_db.commit()

    cache_dir = os.path.abspath(os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "app", "cache",
    ))
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, f"{q.id}.json")
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump({"sentinel": "cached", "confidence_score": 99}, f)

    try:
        r_cached = await client.get(f"/api/v1/questions/{q.id}/analysis")
        assert r_cached.status_code == 200
        assert r_cached.json().get("sentinel") == "cached"

        r_force = await client.get(
            f"/api/v1/questions/{q.id}/analysis",
            params={"force": "true"},
        )
        assert r_force.status_code == 200
        body = r_force.json()
        assert body.get("sentinel") != "cached"
    finally:
        if os.path.exists(cache_path):
            os.remove(cache_path)


@pytest.mark.asyncio
async def test_flush_cache_requires_admin(client: AsyncClient, test_user_token: str):
    resp = await client.delete(
        f"/api/v1/questions/{uuid.uuid4()}/analysis/cache",
        headers={"Authorization": f"Bearer {test_user_token}"},
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_flush_cache_reports_no_file_when_missing(client: AsyncClient, test_db):
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
    q_id = str(uuid.uuid4())
    resp = await client.delete(
        f"/api/v1/questions/{q_id}/analysis/cache",
        headers=headers,
    )
    assert resp.status_code == 200
    assert resp.json()["cache_removed"] is False


@pytest.mark.asyncio
async def test_flush_all_caches(client: AsyncClient, test_db):
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

    cache_dir = os.path.abspath(os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "app", "cache",
    ))
    os.makedirs(cache_dir, exist_ok=True)
    sample = os.path.join(cache_dir, f"{uuid.uuid4()}.json")
    with open(sample, "w") as f:
        f.write("{}")
    try:
        resp = await client.post(
            "/api/v1/questions/admin/analysis/cache/flush-all",
            headers=headers,
        )
        assert resp.status_code == 200
        assert resp.json()["cache_files_removed"] >= 1
    finally:
        if os.path.exists(sample):
            os.remove(sample)
