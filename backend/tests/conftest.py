import pytest
import pytest_asyncio
import uuid
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI
from jose import jwt
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

from app.main import app as real_app
from app.core.dependencies import get_db
from app.core.config import settings
from tests.database_override import init_test_db, get_test_db, test_engine, test_session_factory
from app.models.user import User


_TEST_PRIVATE_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
_TEST_PRIVATE_PEM = _TEST_PRIVATE_KEY.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption(),
).decode()

# Expose the test signing key to app.core.security.create_test_token
import os
os.environ["TEST_JWT_PRIVATE_KEY"] = _TEST_PRIVATE_PEM


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    # Force dev mode in security.py: clear Clerk key so signature verification is skipped
    settings.clerk_secret_key = ""
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


@pytest_asyncio.fixture
async def test_user():
    """A persisted test user. Token returned via test_user_token."""
    async with test_session_factory() as session:
        u = User(
            id=uuid.uuid4(),
            clerk_user_id=f"clerk_test_{uuid.uuid4().hex[:8]}",
            username="tester",
            email="tester@example.com",
            full_name="Test User",
            role="user",
        )
        session.add(u)
        await session.commit()
        await session.refresh(u)
        yield u


@pytest_asyncio.fixture
async def test_user_token(test_user: User) -> str:
    """A test JWT signed with a real RSA key for the test environment."""
    return jwt.encode(
        {"sub": test_user.clerk_user_id},
        _TEST_PRIVATE_PEM,
        algorithm="RS256",
    )


@pytest_asyncio.fixture
async def test_db():
    async with test_session_factory() as session:
        yield session
