from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user_id


async def require_auth(user_id: str | None = Depends(get_current_user_id)) -> str:
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return user_id


async def get_optional_user(user_id: str | None = Depends(get_current_user_id)) -> str | None:
    return user_id
