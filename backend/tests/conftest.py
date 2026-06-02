import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI

from app.main import app as real_app
from app.core.dependencies import get_db
from tests.database_override import init_test_db, get_test_db, test_engine


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    await init_test_db()
    yield
    await test_engine.dispose()


@pytest_asyncio.fixture
async def client():
    real_app.dependency_overrides[get_db] = get_test_db
    transport = ASGITransport(app=real_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    real_app.dependency_overrides.clear()
