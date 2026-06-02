import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_current_user
from app.repositories.users import UserRepository
from app.schemas.users import UserResponse
from app.models.user import User

router = APIRouter(prefix="/api/v1/users", tags=["users"])


def get_repo(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(db)


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(require_current_user)):
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    try:
        uid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    stmt = select(User).where(User.id == uid, User.deleted_at.is_(None))
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: dict,
    user: User = Depends(require_current_user),
    db: AsyncSession = Depends(get_db),
):
    allowed = {"full_name", "bio", "avatar_url"}
    update_data = {k: v for k, v in data.items() if k in allowed}
    for key, value in update_data.items():
        setattr(user, key, value)
    await db.flush()
    await db.refresh(user)
    return user
