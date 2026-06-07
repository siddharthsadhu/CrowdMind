"""Phase 6 migration: make users.clerk_user_id nullable so historical/demo
fixture users can exist in the DB without a corresponding Clerk account.

Idempotent: skips if column is already nullable.

Also: drop the unique index constraint? No, we keep it -- but partial:
NULL values are allowed multiple times (Postgres treats NULLs as distinct
in unique indexes by default).
"""
import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

load_dotenv(Path(__file__).parent.parent / ".env")


async def main():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not set", file=sys.stderr)
        sys.exit(1)
    engine = create_async_engine(db_url)
    async with engine.begin() as conn:
        # Check current nullability
        res = await conn.execute(text("""
            SELECT is_nullable FROM information_schema.columns
            WHERE table_name='users' AND column_name='clerk_user_id'
        """))
        row = res.first()
        if not row:
            print("[ERR] users.clerk_user_id column not found")
            sys.exit(1)

        if row[0] == "YES":
            print("[OK] users.clerk_user_id is already nullable")
            return

        print("[*] Making users.clerk_user_id nullable...")
        await conn.execute(text("""
            ALTER TABLE users ALTER COLUMN clerk_user_id DROP NOT NULL
        """))
        print("[OK] users.clerk_user_id is now nullable")


if __name__ == "__main__":
    asyncio.run(main())
