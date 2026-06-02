from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.repositories.users import UserRepository
from app.models.user import User


async def require_auth(user_id: str | None = Depends(get_current_user_id)) -> str:
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return user_id


async def get_optional_user(user_id: str | None = Depends(get_current_user_id)) -> str | None:
    return user_id


async def get_current_user(
    clerk_user_id: str | None = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    if clerk_user_id is None:
        return None
    repo = UserRepository(db)
    user = await repo.get_by_clerk_id(clerk_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Sync with Clerk first.",
        )
    return user


async def require_current_user(
    user: User | None = Depends(get_current_user),
) -> User:
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return user
