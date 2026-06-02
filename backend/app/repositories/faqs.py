import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.faq import FaqCandidate, PublishedFaq, FaqVersion, FaqSource, FaqContributor


class FaqCandidateRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list(self, page: int = 1, page_size: int = 20, status: str | None = None) -> tuple[list[FaqCandidate], int]:
        conditions = []
        if status:
            conditions.append(FaqCandidate.status == status)
        count_stmt = select(func.count()).select_from(FaqCandidate).where(*conditions)
        total = await self.session.scalar(count_stmt) or 0
        offset = (page - 1) * page_size
        stmt = (
            select(FaqCandidate)
            .where(*conditions)
            .order_by(FaqCandidate.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def get_by_id(self, candidate_id: str) -> FaqCandidate | None:
        stmt = select(FaqCandidate).where(FaqCandidate.id == uuid.UUID(candidate_id))
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def update_status(self, candidate_id: str, status: str) -> FaqCandidate | None:
        candidate = await self.get_by_id(candidate_id)
        if not candidate:
            return None
        candidate.status = status
        candidate.updated_at = datetime.now(timezone.utc)
        await self.session.flush()
        return candidate


class PublishedFaqRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, candidate_id: str, slug: str, title: str, content: str,
                     published_by: str, category_id: str | None = None,
                     confidence_score: float | None = None) -> PublishedFaq:
        faq = PublishedFaq(
            id=uuid.uuid4(),
            candidate_id=uuid.UUID(candidate_id),
            slug=slug,
            title=title,
            content=content,
            category_id=uuid.UUID(category_id) if category_id else None,
            version_number=1,
            confidence_score=confidence_score,
            published_by=uuid.UUID(published_by),
        )
        self.session.add(faq)
        await self.session.flush()

        ver = FaqVersion(
            id=uuid.uuid4(),
            faq_id=faq.id,
            version_number=1,
            title=title,
            content=content,
            change_summary="Initial publication",
            created_by=uuid.UUID(published_by),
            approved_by=uuid.UUID(published_by),
        )
        self.session.add(ver)
        await self.session.flush()
        return faq

    async def get_by_id(self, faq_id: str) -> PublishedFaq | None:
        stmt = select(PublishedFaq).where(
            PublishedFaq.id == uuid.UUID(faq_id),
            PublishedFaq.deleted_at.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> PublishedFaq | None:
        stmt = select(PublishedFaq).where(PublishedFaq.slug == slug, PublishedFaq.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list(self, page: int = 1, page_size: int = 20, category_id: str | None = None) -> tuple[list[PublishedFaq], int]:
        conditions = [PublishedFaq.deleted_at.is_(None)]
        if category_id:
            conditions.append(PublishedFaq.category_id == uuid.UUID(category_id))
        count_stmt = select(func.count()).select_from(PublishedFaq).where(*conditions)
        total = await self.session.scalar(count_stmt) or 0
        offset = (page - 1) * page_size
        stmt = (
            select(PublishedFaq)
            .where(*conditions)
            .order_by(PublishedFaq.published_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total

    async def update(self, faq_id: str, data: dict, updated_by: str) -> PublishedFaq | None:
        faq = await self.get_by_id(faq_id)
        if not faq:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(faq, key, value)
        faq.updated_at = datetime.now(timezone.utc)
        faq.version_number = (faq.version_number or 0) + 1
        await self.session.flush()

        ver = FaqVersion(
            id=uuid.uuid4(),
            faq_id=faq.id,
            version_number=faq.version_number,
            title=faq.title,
            content=faq.content,
            change_summary="Content update",
            created_by=uuid.UUID(updated_by),
        )
        self.session.add(ver)
        await self.session.flush()
        return faq

    async def soft_delete(self, faq_id: str) -> bool:
        faq = await self.get_by_id(faq_id)
        if not faq:
            return False
        faq.deleted_at = datetime.now(timezone.utc)
        await self.session.flush()
        return True


class FaqVersionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_by_faq(self, faq_id: str) -> tuple[list[FaqVersion], int]:
        stmt = (
            select(FaqVersion)
            .where(FaqVersion.faq_id == uuid.UUID(faq_id))
            .order_by(desc(FaqVersion.version_number))
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, len(items)
