"""Provision Clerk users for the seed data.

Run with: cd backend && uv run python -m scripts.seed_clerk

For each user in seed.py's USERS list, ensures a matching Clerk user exists
with the same email and a default password. If the user already exists in
Clerk (by email), it reuses the existing user ID. The matching DB user is
updated with the canonical Clerk user ID.

Users with role == "admin" are also flagged with publicMetadata.role = "admin"
so the AuthProvider sees the admin role on sign-in.

Requires the CLERK_SECRET_KEY in backend/.env.
"""
import asyncio
import sys
from typing import Any

import httpx
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import async_session_factory
from app.models.user import User
from scripts.seed import USERS


CLERK_API_BASE = "https://api.clerk.com/v1"
DEFAULT_PASSWORD = "CrowdMind-Test-2026!"


async def clerk_request(
    method: str, path: str, json: dict | None = None, params: dict | None = None
) -> dict:
    """Make an authenticated request to the Clerk Backend API."""
    headers = {
        "Authorization": f"Bearer {settings.clerk_secret_key}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.request(
            method,
            f"{CLERK_API_BASE}{path}",
            headers=headers,
            json=json,
            params=params,
        )
        if r.status_code >= 400:
            print(f"  [ERR] {method} {path}: {r.status_code} {r.text[:300]}")
        r.raise_for_status()
        return r.json() if r.text else {}


async def find_clerk_user_by_email(email: str) -> dict | None:
    """Look up a Clerk user by email. Returns None if not found."""
    try:
        data = await clerk_request("GET", "/users", params={"email_address": email})
        users = data if isinstance(data, list) else data.get("data", [])
        return users[0] if users else None
    except httpx.HTTPStatusError:
        return None


async def create_clerk_user(seed_user: dict) -> dict:
    """Create a new Clerk user, or return the existing one."""
    existing = await find_clerk_user_by_email(seed_user["email"])
    if existing:
        print(f"  [exists] {seed_user['email']} -> {existing['id']}")
        return existing

    print(f"  [create] {seed_user['email']}")
    user = await clerk_request(
        "POST",
        "/users",
        json={
            "email_address": [seed_user["email"]],
            "first_name": seed_user["full_name"].split(" ")[0],
            "last_name": " ".join(seed_user["full_name"].split(" ")[1:]) or "-",
            "password": DEFAULT_PASSWORD,
        },
    )
    return user


async def set_admin_metadata(clerk_user_id: str) -> None:
    """Set the Clerk user's publicMetadata.role to 'admin'."""
    await clerk_request(
        "PATCH",
        f"/users/{clerk_user_id}",
        json={"public_metadata": {"role": "admin"}},
    )


async def main() -> None:
    if not settings.clerk_secret_key:
        print("[ERR] CLERK_SECRET_KEY not set in .env")
        sys.exit(1)

    print(f"[*] Provisioning {len(USERS)} Clerk users from seed.py USERS list...")
    print(f"    Default password for all users: {DEFAULT_PASSWORD}")
    print()

    admin_count = sum(1 for u in USERS if u.get("role") == "admin")
    user_count = len(USERS) - admin_count
    print(f"    Admins: {admin_count}, Regular users: {user_count}")
    print()

    async with async_session_factory() as session:
        for su in USERS:
            clerk_user = await create_clerk_user(su)

            is_admin = su.get("role") == "admin"
            if is_admin:
                await set_admin_metadata(clerk_user["id"])
                print(f"  [admin] {su['email']} -> publicMetadata.role = 'admin'")

            result = await session.execute(
                select(User).where(User.email == su["email"])
            )
            db_user = result.scalar_one_or_none()
            if db_user:
                if db_user.clerk_user_id != clerk_user["id"]:
                    new_role = "admin" if is_admin else db_user.role
                    await session.execute(
                        update(User)
                        .where(User.id == db_user.id)
                        .values(clerk_user_id=clerk_user["id"], role=new_role)
                    )
                    print(f"  [db]    {su['email']} -> clerk_user_id={clerk_user['id']}")
            else:
                print(f"  [warn]  {su['email']} not found in DB (run seed.py first)")

        await session.commit()

    print()
    print("=" * 60)
    print(f"[OK] Provisioned {len(USERS)} Clerk users!")
    print("=" * 60)
    print()
    print("Test login (all share the default password):")
    for su in USERS:
        tag = " (admin)" if su.get("role") == "admin" else ""
        print(f"  {su['email']:42s}{tag}")
    print()
    print(f"  Password: {DEFAULT_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(main())
