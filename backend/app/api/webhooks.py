import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.repositories.users import UserRepository

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webhooks", tags=["webhooks"])


@router.post("/clerk")
async def clerk_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    if not settings.clerk_secret_key:
        logger.warning("Clerk webhook received but CLERK_SECRET_KEY is not configured — skipping verification")
        return {"ok": True, "message": "skipped"}

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON body")

    event_type = body.get("type")
    data = body.get("data", {})
    logger.info("Clerk webhook event: %s", event_type)

    repo = UserRepository(db)

    if event_type == "user.created" or event_type == "user.updated":
        clerk_id = data.get("id")
        email = ""
        email_addresses = data.get("email_addresses", [])
        if email_addresses:
            email = email_addresses[0].get("email_address", "")

        full_name = data.get("first_name", "") or ""
        if data.get("last_name"):
            full_name = f"{full_name} {data['last_name']}".strip()

        username = data.get("username")
        avatar_url = data.get("image_url")

        await repo.upsert_from_clerk(
            clerk_id=clerk_id,
            email=email,
            full_name=full_name,
            username=username,
            avatar_url=avatar_url,
        )
        logger.info("User synced: %s (%s)", clerk_id, email)

    elif event_type == "user.deleted":
        clerk_id = data.get("id")
        if clerk_id:
            await repo.mark_deleted(clerk_id)
            logger.info("User marked deleted: %s", clerk_id)

    return {"ok": True}
