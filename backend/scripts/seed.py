"""Seed script for initial development data."""

import asyncio
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory
from app.models.user import User
from app.models.question import Category


async def seed():
    async with async_session_factory() as session:
        existing = await session.execute(select(Category).limit(1))
        if existing.scalars().first():
            print("Database already seeded. Skipping.")
            return

        categories = [
            Category(id=uuid.uuid4(), name="Education", slug="education"),
            Category(id=uuid.uuid4(), name="Technology", slug="technology"),
            Category(id=uuid.uuid4(), name="AI", slug="ai"),
            Category(id=uuid.uuid4(), name="Programming", slug="programming"),
            Category(id=uuid.uuid4(), name="Career", slug="career"),
            Category(id=uuid.uuid4(), name="Research", slug="research"),
        ]
        session.add_all(categories)

        admin = User(
            id=uuid.uuid4(),
            clerk_user_id="clerk_admin",
            username="admin",
            email="admin@crowdmind.ai",
            full_name="Admin User",
            role="admin",
            reputation_score=1000,
        )
        session.add(admin)

        await session.commit()
        print("Seed data created successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
