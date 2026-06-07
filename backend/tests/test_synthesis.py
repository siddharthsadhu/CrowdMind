"""Tests for the synthesis service."""
import uuid
from unittest.mock import patch

import pytest

from app.models.discussion import Discussion, Reply
from app.models.user import User
from app.services.synthesis import synthesize_from_discussion


@pytest.mark.asyncio
async def test_synthesis_fallback_when_ai_returns_empty(test_db, test_user: User):
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="How do I reset my password?",
    )
    test_db.add(discussion)
    await test_db.flush()

    reply = Reply(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        user_id=test_user.id,
        content="Click 'forgot password' on the login page.",
        is_accepted=True,
        upvote_count=5,
    )
    test_db.add(reply)
    await test_db.flush()

    with patch("app.services.synthesis.call_json", return_value={}):
        candidate = await synthesize_from_discussion(test_db, discussion, [reply])

    assert candidate.used_fallback is True
    assert "Community answer" in candidate.content
    assert str(reply.id) in candidate.source_reply_ids


@pytest.mark.asyncio
async def test_synthesis_uses_ai_when_valid(test_db, test_user: User):
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="How do I configure HTTPS?",
    )
    test_db.add(discussion)
    await test_db.flush()

    reply = Reply(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        user_id=test_user.id,
        content="Use certbot.",
        is_accepted=True,
        upvote_count=10,
    )
    test_db.add(reply)
    await test_db.flush()

    ai_response = {
        "title": "How do I configure HTTPS?",
        "content": "## Steps\n\n1. Install certbot\n2. Run certbot\n3. Restart",
        "confidence_score": 88,
        "source_reply_ids": [str(reply.id)],
        "reasoning": "Single accepted reply with strong upvotes.",
    }
    with patch("app.services.synthesis.call_json", return_value=ai_response):
        candidate = await synthesize_from_discussion(test_db, discussion, [reply])

    assert candidate.used_fallback is False
    assert candidate.title == "How do I configure HTTPS?"
    assert candidate.confidence_score == 88
    assert "certbot" in candidate.content.lower()


@pytest.mark.asyncio
async def test_synthesis_clamps_confidence(test_db, test_user: User):
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="Out of range?",
    )
    test_db.add(discussion)
    await test_db.flush()

    reply = Reply(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        user_id=test_user.id,
        content="Answer",
        is_accepted=True,
    )
    test_db.add(reply)
    await test_db.flush()

    ai = {
        "title": "Out of range?",
        "content": "ok",
        "confidence_score": 5000,
        "source_reply_ids": [str(reply.id)],
        "reasoning": "extreme",
    }
    with patch("app.services.synthesis.call_json", return_value=ai):
        candidate = await synthesize_from_discussion(test_db, discussion, [reply])
    assert 0 <= candidate.confidence_score <= 100


@pytest.mark.asyncio
async def test_synthesis_no_replies_still_succeeds(test_db, test_user: User):
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="Lurker discussion",
    )
    test_db.add(discussion)
    await test_db.flush()

    with patch("app.services.synthesis.call_json", return_value={}):
        candidate = await synthesize_from_discussion(test_db, discussion, [])
    assert candidate.used_fallback is True
    assert "no replies" in candidate.content.lower() or "no replies yet" in candidate.content.lower()
