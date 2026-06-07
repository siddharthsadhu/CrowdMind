"""Delete all Clerk users in the dev instance.

WARNING: This will permanently delete every user in your Clerk dev instance.
Use only when cleaning up seed data or resetting for a fresh demo.

Run with: cd backend && uv run python -m scripts.delete_all_clerk_users

To delete a single user by email instead, use:
  uv run python -m scripts.promote_to_admin --demote --email someone@example.com
  (then delete manually via Clerk dashboard)

This script uses the Clerk Backend API to list all users and DELETE each one.
"""
import asyncio
import sys

import httpx

from app.core.config import settings


CLERK_API_BASE = "https://api.clerk.com/v1"


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.clerk_secret_key}",
        "Content-Type": "application/json",
    }


async def list_all_clerk_users() -> list[dict]:
    """Fetch all users in the Clerk instance (handles pagination)."""
    if not settings.clerk_secret_key:
        print("[ERR] CLERK_SECRET_KEY not set in backend/.env")
        sys.exit(1)

    all_users = []
    offset = 0
    limit = 100
    async with httpx.AsyncClient(timeout=30) as client:
        while True:
            r = await client.get(
                f"{CLERK_API_BASE}/users",
                headers=_headers(),
                params={"limit": limit, "offset": offset},
            )
            r.raise_for_status()
            data = r.json()
            users = data if isinstance(data, list) else data.get("data", [])
            all_users.extend(users)
            if len(users) < limit:
                break
            offset += limit
    return all_users


async def delete_clerk_user(user_id: str) -> bool:
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.delete(
            f"{CLERK_API_BASE}/users/{user_id}",
            headers=_headers(),
        )
        return r.status_code < 400


async def main():
    print("[*] Fetching all users from Clerk...")
    users = await list_all_clerk_users()
    print(f"    Found {len(users)} users in Clerk.")
    if not users:
        print("[OK] No users to delete. Exiting.")
        return

    print()
    print("Users that will be deleted:")
    for u in users:
        email = "?"
        try:
            email = u.get("email_addresses", [{}])[0].get("email_address", "?")
        except Exception:
            pass
        first = u.get("first_name") or ""
        last = u.get("last_name") or ""
        name = f"{first} {last}".strip() or "(no name)"
        print(f"  {u['id']:36s}  {email:42s}  {name}")

    print()
    confirm = input(f"Type 'DELETE ALL {len(users)} USERS' to confirm: ")
    if confirm != f"DELETE ALL {len(users)} USERS":
        print("[ABORTED] No users deleted.")
        return

    print()
    print("[*] Deleting...")
    deleted = 0
    failed = 0
    for u in users:
        ok = await delete_clerk_user(u["id"])
        if ok:
            deleted += 1
            print(f"  [OK]   {u['id']}")
        else:
            failed += 1
            print(f"  [FAIL] {u['id']}")

    print()
    print("=" * 60)
    print(f"[DONE] Deleted {deleted}/{len(users)} users (failed: {failed})")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
