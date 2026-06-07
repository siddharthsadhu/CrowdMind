from fastapi import HTTPException, status

from app.repositories.faqs import FaqCandidateRepository, PublishedFaqRepository, FaqVersionRepository
from app.schemas.faqs import (
    FaqCandidateResponse, FaqCandidateListResponse,
    PublishedFaqResponse, PublishedFaqListResponse,
    PublishedFaqUpdate, FaqVersionResponse, FaqVersionListResponse,
)
from app.services.evolution import record_event
import logging

logger = logging.getLogger(__name__)


class FaqCandidateService:
    def __init__(self, repo: FaqCandidateRepository, db=None):
        self.repo = repo
        self.db = db

    async def list(self, page: int = 1, page_size: int = 20, status: str | None = None) -> FaqCandidateListResponse:
        items, total = await self.repo.list(page=page, page_size=page_size, status=status)
        return FaqCandidateListResponse(
            items=[FaqCandidateResponse.model_validate(c) for c in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def get_by_id(self, candidate_id: str) -> FaqCandidateResponse:
        candidate = await self.repo.get_by_id(candidate_id)
        if not candidate:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ candidate not found")
        return FaqCandidateResponse.model_validate(candidate)

    async def review(self, candidate_id: str, status: str, reviewer_id: str | None = None) -> FaqCandidateResponse:
        candidate = await self.repo.update_status(candidate_id, status)
        if not candidate:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ candidate not found")

        if self.db is not None:
            try:
                event_type = (
                    "CANDIDATE_APPROVED" if status == "APPROVED"
                    else "CANDIDATE_REJECTED" if status == "REJECTED"
                    else "CANDIDATE_REVIEWED"
                )
                await record_event(
                    self.db,
                    faq_id=str(candidate.discussion_id),
                    event_type=event_type,
                    description=f"Candidate '{candidate.title}' marked {status}",
                    triggered_by=reviewer_id,
                )
            except Exception as err:
                logger.warning("[FaqCandidateService] review event failed: %s", err)

        return FaqCandidateResponse.model_validate(candidate)


class PublishedFaqService:
    def __init__(self, repo: PublishedFaqRepository, db=None):
        self.repo = repo
        self.db = db

    async def create_from_candidate(self, candidate_id: str, published_by: str,
                                    slug: str, title: str | None = None, content: str | None = None,
                                    category_id: str | None = None) -> PublishedFaqResponse:
        faq = await self.repo.create(
            candidate_id=candidate_id,
            slug=slug,
            title=title or "",
            content=content or "",
            published_by=published_by,
            category_id=category_id,
        )
        if self.db is not None:
            try:
                await record_event(
                    self.db,
                    faq_id=str(faq.id),
                    event_type="FAQ_PUBLISHED",
                    description=f"Published from candidate (v{faq.version_number})",
                    triggered_by=published_by,
                )
            except Exception as err:
                logger.warning("[PublishedFaqService] publish event failed: %s", err)
        return PublishedFaqResponse.model_validate(faq)

    async def get_by_id(self, faq_id: str) -> PublishedFaqResponse:
        faq = await self.repo.get_by_id(faq_id)
        if not faq:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
        return PublishedFaqResponse.model_validate(faq)

    async def get_by_slug(self, slug: str) -> PublishedFaqResponse:
        faq = await self.repo.get_by_slug(slug)
        if not faq:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
        return PublishedFaqResponse.model_validate(faq)

    async def list(self, page: int = 1, page_size: int = 20, category_id: str | None = None) -> PublishedFaqListResponse:
        items, total = await self.repo.list(page=page, page_size=page_size, category_id=category_id)
        return PublishedFaqListResponse(
            items=[PublishedFaqResponse.model_validate(f) for f in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def update(self, faq_id: str, data: PublishedFaqUpdate, user_id: str) -> PublishedFaqResponse:
        faq = await self.repo.get_by_id(faq_id)
        if not faq:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
        update_data = {k: v for k, v in data.model_dump(exclude_none=True).items()}
        old_version = faq.version_number
        updated = await self.repo.update(faq_id, update_data, user_id)

        if self.db is not None:
            try:
                await record_event(
                    self.db,
                    faq_id=str(updated.id),
                    event_type="FAQ_UPDATED",
                    description=(
                        f"FAQ updated: v{old_version} → v{updated.version_number}"
                        + (f"; title changed" if "title" in update_data else "")
                        + (f"; content changed" if "content" in update_data else "")
                    ),
                    triggered_by=user_id,
                )
            except Exception as err:
                logger.warning("[PublishedFaqService] update event failed: %s", err)

        return PublishedFaqResponse.model_validate(updated)

    async def delete(self, faq_id: str) -> None:
        deleted = await self.repo.soft_delete(faq_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")


class FaqVersionService:
    def __init__(self, repo: FaqVersionRepository):
        self.repo = repo

    async def list_by_faq(self, faq_id: str) -> FaqVersionListResponse:
        items, total = await self.repo.list_by_faq(faq_id)
        return FaqVersionListResponse(
            items=[FaqVersionResponse.model_validate(v) for v in items],
            total=total,
        )
