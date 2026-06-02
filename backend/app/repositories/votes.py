import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.discussion import Vote, Reply


class VoteRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def upsert(self, user_id: str, target_type: str, target_id: str, vote_type: str) -> Vote:
        stmt = select(Vote).where(
            Vote.user_id == uuid.UUID(user_id),
            Vote.target_type == target_type,
            Vote.target_id == uuid.UUID(target_id),
        )
        result = await self.session.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            existing.vote_type = vote_type
            existing.created_at = datetime.now(timezone.utc)
            vote = existing
        else:
            vote = Vote(
                id=uuid.uuid4(),
                user_id=uuid.UUID(user_id),
                target_type=target_type,
                target_id=uuid.UUID(target_id),
                vote_type=vote_type,
            )
            self.session.add(vote)

        await self._sync_reply_counts(target_type, target_id)
        await self.session.flush()
        return vote

    async def remove(self, user_id: str, target_type: str, target_id: str) -> bool:
        stmt = select(Vote).where(
            Vote.user_id == uuid.UUID(user_id),
            Vote.target_type == target_type,
            Vote.target_id == uuid.UUID(target_id),
        )
        result = await self.session.execute(stmt)
        vote = result.scalar_one_or_none()
        if not vote:
            return False
        await self.session.delete(vote)
        await self._sync_reply_counts(target_type, target_id)
        await self.session.flush()
        return True

    async def _sync_reply_counts(self, target_type: str, target_id: str) -> None:
        if target_type != "reply":
            return
        tid = uuid.UUID(target_id)
        up = await self.session.scalar(
            select(func.count()).select_from(Vote).where(
                Vote.target_id == tid,
                Vote.target_type == "reply",
                Vote.vote_type == "UPVOTE",
            )
        ) or 0
        down = await self.session.scalar(
            select(func.count()).select_from(Vote).where(
                Vote.target_id == tid,
                Vote.target_type == "reply",
                Vote.vote_type == "DOWNVOTE",
            )
        ) or 0
        stmt = select(Reply).where(Reply.id == tid)
        result = await self.session.execute(stmt)
        reply = result.scalar_one_or_none()
        if reply:
            reply.upvote_count = up
            reply.downvote_count = down

    async def get_user_vote(self, user_id: str, target_type: str, target_id: str) -> Vote | None:
        stmt = select(Vote).where(
            Vote.user_id == uuid.UUID(user_id),
            Vote.target_type == target_type,
            Vote.target_id == uuid.UUID(target_id),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
