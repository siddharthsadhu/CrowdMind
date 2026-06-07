"""Consensus computation.

Consensus is a 0-100 score that reflects how strongly a discussion's
community has converged on an answer. It is a weighted signal that
combines:

- Whether an answer has been accepted (and by whom)
- Upvote/downvote ratios on accepted and top replies
- Participant breadth (more participants = more confidence)
- Contributor reputation (higher-rep users carry more weight)

The score is intentionally conservative: 50 = open debate, 80 = strong
agreement, 90+ = community-blessed.
"""
from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.discussion import Discussion, Reply, Vote, ConsensusSignal
from app.models.user import User


@dataclass
class ConsensusBreakdown:
    score: float
    accepted_weight: float
    upvote_weight: float
    participant_weight: float
    reputation_weight: float
    signals_logged: int


def _clamp(value: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, value))


async def compute_consensus(
    db: AsyncSession,
    discussion: Discussion,
    replies: list[Reply],
) -> ConsensusBreakdown:
    """Compute the consensus score for a discussion.

    Algorithm:
    1. accepted_weight (0-30): 30 if an accepted reply exists, else 0
    2. upvote_weight (0-30): 30 * (accepted_upvotes / max(accepted_upvotes, 5))
       — caps so a single upvote doesn't push to 100
    3. participant_weight (0-20): 20 * (1 - exp(-n/8)) — saturating
    4. reputation_weight (0-20): average reputation of top-3 repliers, scaled
    """
    accepted = next((r for r in replies if r.is_accepted), None)

    accepted_weight = 30.0 if accepted else 0.0

    if accepted:
        accepted_up = max(accepted.upvote_count, 0)
        accepted_down = max(accepted.downvote_count, 0)
        denom = max(accepted_up + accepted_down, 1)
        ratio = accepted_up / denom
        upvote_weight = 30.0 * min(1.0, accepted_up / 5.0) * (0.5 + 0.5 * ratio)
    else:
        top_reply = max(replies, key=lambda r: r.upvote_count - r.downvote_count, default=None)
        if top_reply:
            top_up = max(top_reply.upvote_count, 0)
            upvote_weight = 20.0 * min(1.0, top_up / 5.0)
        else:
            upvote_weight = 0.0

    n_participants = max(discussion.participant_count or 0, len({r.user_id for r in replies}))
    import math
    participant_weight = 20.0 * (1.0 - math.exp(-n_participants / 8.0))

    reputation_weight = 0.0
    if replies:
        top_repliers = sorted(replies, key=lambda r: r.upvote_count, reverse=True)[:3]
        replier_ids = [r.user_id for r in top_repliers]
        rep_rows = await db.execute(
            select(User.id, User.reputation_score).where(User.id.in_(replier_ids))
        )
        rep_map = {row.id: row.reputation_score or 0 for row in rep_rows.all()}
        avg_rep = sum(rep_map.values()) / max(len(rep_map), 1)
        reputation_weight = 20.0 * min(1.0, avg_rep / 200.0)

    score = _clamp(
        accepted_weight + upvote_weight + participant_weight + reputation_weight
    )

    return ConsensusBreakdown(
        score=round(score, 2),
        accepted_weight=round(accepted_weight, 2),
        upvote_weight=round(upvote_weight, 2),
        participant_weight=round(participant_weight, 2),
        reputation_weight=round(reputation_weight, 2),
        signals_logged=0,
    )


async def persist_consensus_signal(
    db: AsyncSession,
    discussion_id: str,
    reply_id: str | None,
    breakdown: ConsensusBreakdown,
) -> ConsensusSignal:
    """Record this computation in the consensus_signals audit log."""
    import uuid as _uuid
    signal = ConsensusSignal(
        id=_uuid.uuid4(),
        discussion_id=_uuid.UUID(discussion_id) if isinstance(discussion_id, str) else discussion_id,
        reply_id=_uuid.UUID(reply_id) if reply_id and isinstance(reply_id, str) else reply_id,
        agreement_score=breakdown.score,
        trust_score=breakdown.reputation_weight,
        reputation_weight=breakdown.reputation_weight,
    )
    db.add(signal)
    await db.flush()
    return signal
