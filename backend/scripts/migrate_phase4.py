"""Add columns for archive/delete notifications, action taken/notes on reports.

Idempotent: uses IF NOT EXISTS where possible; skips if column already exists.
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
        # Notifications: is_archived, deleted_at
        res = await conn.execute(text("""
            SELECT column_name FROM information_schema.columns
            WHERE table_name='notifications' AND column_name IN ('is_archived', 'deleted_at')
        """))
        existing = {row[0] for row in res.all()}
        if 'is_archived' not in existing:
            await conn.execute(text("ALTER TABLE notifications ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_notifications_is_archived ON notifications(is_archived)"))
            print("Added notifications.is_archived")
        else:
            print("notifications.is_archived already exists")
        if 'deleted_at' not in existing:
            await conn.execute(text("ALTER TABLE notifications ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE"))
            print("Added notifications.deleted_at")
        else:
            print("notifications.deleted_at already exists")

        # Reports: action_taken, resolution_notes, resolved_at, resolved_by
        res = await conn.execute(text("""
            SELECT column_name FROM information_schema.columns
            WHERE table_name='reports' AND column_name IN ('action_taken', 'resolution_notes', 'resolved_at', 'resolved_by')
        """))
        existing = {row[0] for row in res.all()}
        if 'action_taken' not in existing:
            await conn.execute(text("ALTER TABLE reports ADD COLUMN action_taken VARCHAR"))
            print("Added reports.action_taken")
        else:
            print("reports.action_taken already exists")
        if 'resolution_notes' not in existing:
            await conn.execute(text("ALTER TABLE reports ADD COLUMN resolution_notes TEXT"))
            print("Added reports.resolution_notes")
        else:
            print("reports.resolution_notes already exists")
        if 'resolved_at' not in existing:
            await conn.execute(text("ALTER TABLE reports ADD COLUMN resolved_at TIMESTAMP WITH TIME ZONE"))
            print("Added reports.resolved_at")
        else:
            print("reports.resolved_at already exists")
        if 'resolved_by' not in existing:
            await conn.execute(text("ALTER TABLE reports ADD COLUMN resolved_by UUID REFERENCES users(id)"))
            print("Added reports.resolved_by")
        else:
            print("reports.resolved_by already exists")

    await engine.dispose()
    print("Migrations done.")


if __name__ == "__main__":
    asyncio.run(main())
