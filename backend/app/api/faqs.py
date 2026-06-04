from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_auth
from app.core.uuid_utils import parse_uuid
from app.repositories.faqs import FaqCandidateRepository, PublishedFaqRepository, FaqVersionRepository
from app.services.faqs import FaqCandidateService, PublishedFaqService, FaqVersionService
from app.schemas.faqs import (
    FaqCandidateResponse, FaqCandidateListResponse, FaqCandidateReview,
    PublishedFaqResponse, PublishedFaqListResponse, PublishedFaqUpdate,
    FaqVersionListResponse,
)

router = APIRouter(prefix="/api/v1/faqs", tags=["faqs"])


def get_candidate_service(db: AsyncSession = Depends(get_db)) -> FaqCandidateService:
    return FaqCandidateService(FaqCandidateRepository(db))


def get_published_service(db: AsyncSession = Depends(get_db)) -> PublishedFaqService:
    return PublishedFaqService(PublishedFaqRepository(db))


def get_version_service(db: AsyncSession = Depends(get_db)) -> FaqVersionService:
    return FaqVersionService(FaqVersionRepository(db))


# --- FAQ Candidates ---
@router.get("/candidates", response_model=FaqCandidateListResponse)
async def list_candidates(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = None,
    service: FaqCandidateService = Depends(get_candidate_service),
):
    return await service.list(page=page, page_size=page_size, status=status)


@router.get("/candidates/{candidate_id}", response_model=FaqCandidateResponse)
async def get_candidate(
    candidate_id: str,
    service: FaqCandidateService = Depends(get_candidate_service),
):
    parse_uuid(candidate_id, "candidate_id")
    return await service.get_by_id(candidate_id)


@router.patch("/candidates/{candidate_id}/review", response_model=FaqCandidateResponse)
async def review_candidate(
    candidate_id: str,
    data: FaqCandidateReview,
    service: FaqCandidateService = Depends(get_candidate_service),
):
    parse_uuid(candidate_id, "candidate_id")
    return await service.review(candidate_id, data.status)


# --- Published FAQs ---
@router.get("", response_model=PublishedFaqListResponse)
async def list_faqs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: str | None = None,
    service: PublishedFaqService = Depends(get_published_service),
):
    return await service.list(page=page, page_size=page_size, category_id=category_id)


@router.get("/by-slug/{slug}", response_model=PublishedFaqResponse)
async def get_faq_by_slug(
    slug: str,
    service: PublishedFaqService = Depends(get_published_service),
):
    return await service.get_by_slug(slug)


@router.get("/{faq_id}", response_model=PublishedFaqResponse)
async def get_faq(
    faq_id: str,
    service: PublishedFaqService = Depends(get_published_service),
):
    parse_uuid(faq_id, "faq_id")
    return await service.get_by_id(faq_id)


@router.post("/from-candidate", response_model=PublishedFaqResponse, status_code=201)
async def publish_faq(
    candidate_id: str = Query(...),
    slug: str = Query(...),
    title: str | None = Query(None),
    content: str | None = Query(None),
    category_id: str | None = Query(None),
    user_id: str = Depends(require_auth),
    service: PublishedFaqService = Depends(get_published_service),
):
    return await service.create_from_candidate(
        candidate_id=candidate_id,
        published_by=user_id,
        slug=slug,
        title=title,
        content=content,
        category_id=category_id,
    )


@router.patch("/{faq_id}", response_model=PublishedFaqResponse)
async def update_faq(
    faq_id: str,
    data: PublishedFaqUpdate,
    user_id: str = Depends(require_auth),
    service: PublishedFaqService = Depends(get_published_service),
):
    parse_uuid(faq_id, "faq_id")
    return await service.update(faq_id, data, user_id)


@router.delete("/{faq_id}", status_code=204)
async def delete_faq(
    faq_id: str,
    service: PublishedFaqService = Depends(get_published_service),
):
    parse_uuid(faq_id, "faq_id")
    await service.delete(faq_id)


# --- FAQ Versions ---
@router.get("/{faq_id}/versions", response_model=FaqVersionListResponse)
async def list_versions(
    faq_id: str,
    service: FaqVersionService = Depends(get_version_service),
):
    parse_uuid(faq_id, "faq_id")
    return await service.list_by_faq(faq_id)
