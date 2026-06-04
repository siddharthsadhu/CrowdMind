from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine
from app.api.questions import router as questions_router
from app.api.webhooks import router as webhooks_router
from app.api.users import router as users_router
from app.api.discussions import router as discussions_router
from app.api.replies import router as replies_router, direct_router as replies_direct_router
from app.api.votes import router as votes_router
from app.api.faqs import router as faqs_router
from app.api.reports import router as reports_router
from app.api.notifications import router as notifications_router
from app.api.analytics import router as analytics_router
from app.api.categories import router as categories_router
from app.api.saved import router as saved_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting CrowdMind API")
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions_router)
app.include_router(webhooks_router)
app.include_router(users_router)
app.include_router(discussions_router)
app.include_router(replies_router)
app.include_router(replies_direct_router)
app.include_router(votes_router)
app.include_router(faqs_router)
app.include_router(reports_router)
app.include_router(notifications_router)
app.include_router(analytics_router)
app.include_router(categories_router)
app.include_router(saved_router)


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
