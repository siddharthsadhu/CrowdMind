import uuid
import random

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user_id, verify_clerk_token
from app.repositories.users import UserRepository
from app.models.user import User


# Marvel hero suffixes (gender-neutral heroes included in both)
_HERO_HANDLES = [
    "ironman", "starlord", "thor", "hawkeye", "antman", "captainamerica",
    "spiderman", "doctorStrange", "blackpanther", "warmachine",
    "blackwidow", "scarletwitch", "captainmarvel", "nebula", "gamora",
    "shuri", "okoye", "wasp",
]


def _generate_username(first_name: str, email: str) -> str:
    """Generate a cool Marvel-inspired username like 'siddharth-ironman'."""
    base = (first_name or email.split("@")[0]).lower().strip()
    # Remove special chars, keep alphanumeric
    base = "".join(c for c in base if c.isalnum())
    if not base:
        base = "member"
    hero = random.choice(_HERO_HANDLES)
    return f"{base}-{hero}"


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
    payload: dict | None = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Return the current User.

    On the first authenticated request from a new Clerk user, this auto-creates
    a DB row from the Clerk JWT claims (email, name, avatar, role) so they can
    use the API immediately. The role comes from Clerk publicMetadata.role
    -- which is set manually in the Clerk dashboard.

    For an existing user, the role is re-synced from the JWT on every request
    so a promotion/demotion done in the Clerk dashboard (or via the
    promote_to_admin script) takes effect on the user's next sign-in.
    """
    if clerk_user_id is None:
        return None
    repo = UserRepository(db)
    user = await repo.get_by_clerk_id(clerk_user_id)

    if not payload:
        # No JWT claims means we can't auto-create or sync. Just return what
        # we have (or None if this is a new user).
        return user

    public_meta = payload.get("public_metadata") or {}
    jwt_role = public_meta.get("role") or "user"

    if not user:
        # Auto-create on first sign-in
        email = payload.get("email") or payload.get("email_address") or f"{clerk_user_id}@placeholder.crowdmind.dev"
        first = payload.get("first_name") or ""
        last = payload.get("last_name") or ""
        full_name = (f"{first} {last}").strip() or payload.get("name") or f"Member {clerk_user_id[-6:]}"
        image_url = payload.get("image_url") or None

        # Generate a cool Marvel-inspired username instead of raw Clerk ID
        username_base = first or email.split("@")[0] or "member"
        auto_username = _generate_username(username_base, email)

        try:
            async with db.begin_nested():
                user = await repo.upsert_from_clerk(
                    clerk_id=clerk_user_id,
                    email=email,
                    full_name=full_name,
                    username=auto_username,
                    avatar_url=image_url,
                )
                user.role = jwt_role if jwt_role in ("admin", "user") else "user"
        except Exception:
            # If a parallel request already inserted the user, rollback nested savepoint and fetch the user
            user = await repo.get_by_clerk_id(clerk_user_id)
            if not user:
                raise
    else:
        # Existing user: sync role from JWT (so Clerk-side promotion works)
        # Also fix any user whose username is the raw Clerk ID
        if user.username == clerk_user_id or user.username.startswith("user_"):
            first = payload.get("first_name") or ""
            email_val = payload.get("email") or user.email or ""
            user.username = _generate_username(first or email_val.split("@")[0], email_val)
        if jwt_role in ("admin", "user") and user.role != jwt_role:
            user.role = jwt_role

    # Persist any role change
    await db.commit()
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
