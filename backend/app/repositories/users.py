import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_clerk_id(self, clerk_id: str) -> User | None:
        stmt = select(User).where(User.clerk_user_id == clerk_id, User.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def upsert_from_clerk(self, clerk_id: str, email: str, full_name: str, username: str | None = None, avatar_url: str | None = None) -> User:
        existing = await self.get_by_clerk_id(clerk_id)
        if existing:
            existing.email = email
            existing.full_name = full_name
            if username:
                existing.username = username
            if avatar_url is not None:
                existing.avatar_url = avatar_url
            existing.updated_at = datetime.now(timezone.utc)
            await self.session.flush()
            return existing

        user = User(
            id=uuid.uuid4(),
            clerk_user_id=clerk_id,
            username=username or email.split("@")[0],
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            role="user",
        )
        self.session.add(user)
        await self.session.flush()
        return user

    async def mark_deleted(self, clerk_id: str) -> bool:
        user = await self.get_by_clerk_id(clerk_id)
        if not user:
            return False
        user.deleted_at = datetime.now(timezone.utc)
        await self.session.flush()
        return True
