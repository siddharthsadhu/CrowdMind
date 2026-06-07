"""Tests for the consensus scoring service."""
import uuid

import pytest
from httpx import AsyncClient

from app.models.discussion import Discussion, Reply
from app.models.user import User
from app.services.consensus import compute_consensus, persist_consensus_signal


@pytest.mark.asyncio
async def test_consensus_no_replies_is_low(test_db, test_user: User):
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="Empty discussion",
        participant_count=1,
    )
    test_db.add(discussion)
    await test_db.flush()

    breakdown = await compute_consensus(test_db, discussion, [])
    assert breakdown.score < 5
    assert breakdown.accepted_weight == 0


@pytest.mark.asyncio
async def test_consensus_with_accepted_answer_is_high(test_db, test_user: User):
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="Answered discussion",
        participant_count=4,
    )
    test_db.add(discussion)
    await test_db.flush()

    accepted = Reply(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        user_id=test_user.id,
        content="The answer is 42.",
        is_accepted=True,
        upvote_count=12,
        downvote_count=1,
    )
    test_db.add(accepted)
    await test_db.flush()

    breakdown = await compute_consensus(test_db, discussion, [accepted])
    assert breakdown.accepted_weight == 30
    assert breakdown.score >= 60
    assert breakdown.score <= 100


@pytest.mark.asyncio
async def test_consensus_clamped_to_100(test_db, test_user: User):
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="Huge discussion",
        participant_count=50,
    )
    test_db.add(discussion)
    await test_db.flush()

    accepted = Reply(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        user_id=test_user.id,
        content="Definitive answer.",
        is_accepted=True,
        upvote_count=1000,
    )
    test_db.add(accepted)
    await test_db.flush()

    breakdown = await compute_consensus(test_db, discussion, [accepted])
    assert breakdown.score <= 100


@pytest.mark.asyncio
async def test_consensus_signal_persisted(test_db, test_user: User):
    discussion = Discussion(
        id=uuid.uuid4(),
        created_by=test_user.id,
        title="Tracked discussion",
    )
    test_db.add(discussion)
    await test_db.flush()

    accepted = Reply(
        id=uuid.uuid4(),
        discussion_id=discussion.id,
        user_id=test_user.id,
        content="Hi",
        is_accepted=True,
        upvote_count=3,
    )
    test_db.add(accepted)
    await test_db.flush()

    breakdown = await compute_consensus(test_db, discussion, [accepted])
    signal = await persist_consensus_signal(test_db, str(discussion.id), str(accepted.id), breakdown)
    await test_db.commit()
    assert signal.agreement_score == breakdown.score
    assert signal.discussion_id == discussion.id
