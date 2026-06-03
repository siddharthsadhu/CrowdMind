import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_db
from app.models.question import Category

router = APIRouter(prefix="/api/v1/categories", tags=["categories"])


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str

    model_config = {"from_attributes": True}


@router.get("", response_model=list[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category))
    categories = result.scalars().all()
    return [
        CategoryResponse(id=str(c.id), name=c.name, slug=c.slug)
        for c in categories
    ]
