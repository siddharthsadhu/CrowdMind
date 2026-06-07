"""Delete Clerk accounts for all 30 historical demo contributors.

Run with: cd backend && uv run python -m scripts.delete_demo_clerk_users

This removes the 30 fake Clerk accounts so they cannot be targeted by
phishing, can't appear in Clerk's user list, and don't trigger
"new device verification" for fake emails.

It does NOT touch the DB. The 30 users still exist in the DB (see
docs/historical_demo_contributors.md).

Requires CLERK_SECRET_KEY in backend/.env.
"""
import argparse
import asyncio
import sys

import httpx
from sqlalchemy import select

from app.core.config import settings
from app.core.database import async_session_factory
from app.models.user import User


CLERK_API_BASE = "https://api.clerk.com/v1"


async def delete_clerk_user(clerk_id: str) -> bool:
    headers = {"Authorization": f"Bearer {settings.clerk_secret_key}"}
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.delete(f"{CLERK_API_BASE}/users/{clerk_id}", headers=headers)
        if r.status_code == 404:
            return True
        if r.status_code >= 400:
            print(f"  [ERR] DELETE /users/{clerk_id}: {r.status_code} {r.text[:200]}")
            return False
        return True


async def main() -> None:
    parser = argparse.ArgumentParser(description="Delete demo Clerk users")
    parser.add_argument("--yes", action="store_true", help="Skip confirmation prompt")
    args = parser.parse_args()

    if not settings.clerk_secret_key:
        print("[ERR] CLERK_SECRET_KEY not set in backend/.env")
        sys.exit(1)

    async with async_session_factory() as session:
        result = await session.execute(
            select(User).order_by(User.email).where(User.deleted_at.is_(None))
        )
        users = result.scalars().all()

    target_ids = [u.clerk_user_id for u in users if u.clerk_user_id.startswith("user_")]
    print(f"[*] Found {len(users)} DB users; {len(target_ids)} have a real Clerk ID")
    print(f"[*] Will DELETE the following Clerk accounts:")
    for u in users:
        if u.clerk_user_id.startswith("user_"):
            print(f"    - {u.email:42s}  clerk={u.clerk_user_id}")
    print()

    if not args.yes:
        confirm = input("Type 'yes' to confirm deletion (this is IRREVERSIBLE): ").strip()
        if confirm != "yes":
            print("[ABORTED]")
            return
    else:
        print("[AUTO-CONFIRMED via --yes flag]")
        print()

    print()
    deleted = 0
    failed = []
    for u in users:
        if not u.clerk_user_id.startswith("user_"):
            continue
        print(f"  Deleting {u.email} ({u.clerk_user_id})...", end=" ")
        ok = await delete_clerk_user(u.clerk_user_id)
        if ok:
            print("OK")
            deleted += 1
        else:
            print("FAILED")
            failed.append(u.email)

    print()
    print("=" * 60)
    print(f"[OK] Deleted {deleted}/{len(target_ids)} Clerk accounts")
    if failed:
        print(f"[FAIL] {len(failed)} failed:")
        for e in failed:
            print(f"  - {e}")
    print("=" * 60)
    print()
    print("DB users are UNTOUCHED. They still appear in:")
    print("  - FAQ author attributions")
    print("  - Discussion threads")
    print("  - Reply authorship")
    print("  - Notification recipients")
    print("  - Achievement winners")
    print("  - All admin views (Mission Control, Members, etc.)")
    print()
    print("See docs/historical_demo_contributors.md for the full list.")


if __name__ == "__main__":
    asyncio.run(main())
