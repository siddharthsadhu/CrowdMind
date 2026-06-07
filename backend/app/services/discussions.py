from fastapi import HTTPException, status

from app.repositories.discussions import DiscussionRepository
from app.schemas.discussions import DiscussionCreate, DiscussionUpdate, DiscussionResponse, DiscussionListResponse
from app.services.consensus import compute_consensus, persist_consensus_signal
from app.services.evolution import record_event
from app.services.synthesis import synthesize_from_discussion
from app.models.faq import FaqCandidate
import uuid


class DiscussionService:
    def __init__(self, repo: DiscussionRepository, db=None):
        self.repo = repo
        self.db = db

    async def create(self, user_id: str, data: DiscussionCreate) -> DiscussionResponse:
        discussion = await self.repo.create(
            created_by=user_id,
            title=data.title,
            description=data.description,
            question_id=data.question_id,
        )
        return DiscussionResponse.model_validate(discussion)

    async def get_by_id(self, discussion_id: str) -> DiscussionResponse:
        discussion = await self.repo.get_by_id(discussion_id)
        if not discussion:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Discussion not found")
        return DiscussionResponse.model_validate(discussion)

    async def list(
        self,
        page: int = 1,
        page_size: int = 20,
        status: str | None = None,
    ) -> DiscussionListResponse:
        items, total = await self.repo.list(
            page=page,
            page_size=page_size,
            status=status,
        )
        return DiscussionListResponse(
            items=[DiscussionResponse.model_validate(d) for d in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def update(self, discussion_id: str, data: DiscussionUpdate, user_id: str) -> DiscussionResponse:
        discussion = await self.repo.get_by_id(discussion_id)
        if not discussion:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Discussion not found")
        if str(discussion.created_by) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this discussion")
        update_data = {k: v for k, v in data.model_dump(exclude_none=True).items()}
        updated = await self.repo.update(discussion_id, update_data)
        return DiscussionResponse.model_validate(updated)

    async def delete(self, discussion_id: str, user_id: str) -> None:
        discussion = await self.repo.get_by_id(discussion_id)
        if not discussion:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Discussion not found")
        if str(discussion.created_by) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this discussion")
        await self.repo.soft_delete(discussion_id)

    async def accept_reply(self, discussion_id: str, reply_id: str, user_id: str) -> DiscussionResponse:
        discussion = await self.repo.get_by_id(discussion_id)
        if not discussion:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Discussion not found")
        if str(discussion.created_by) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the discussion author can accept a reply")
        reply = await self.repo.get_reply_by_id(reply_id)
        if not reply:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reply not found")
        if str(reply.discussion_id) != discussion_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reply does not belong to this discussion")
        await self.repo.unaccept_all_replies(discussion_id)
        await self.repo.accept_reply(reply_id)
        await self.repo.update(discussion_id, {"status": "ANSWERED"})
        updated = await self.repo.get_by_id(discussion_id)

        if self.db is not None:
            try:
                all_replies = await self.repo.get_replies(discussion_id)
                breakdown = await compute_consensus(self.db, updated, all_replies)
                updated.consensus_score = breakdown.score
                await self.repo.update(discussion_id, {"consensus_score": breakdown.score})
                await persist_consensus_signal(
                    self.db,
                    str(updated.id),
                    str(reply.id),
                    breakdown,
                )

                candidate = await synthesize_from_discussion(self.db, updated, all_replies)
                candidate_row = FaqCandidate(
                    id=uuid.uuid4(),
                    discussion_id=updated.id,
                    generated_by_ai=not candidate.used_fallback,
                    title=candidate.title,
                    content=candidate.content,
                    confidence_score=candidate.confidence_score,
                    status="PENDING",
                )
                self.db.add(candidate_row)

                await record_event(
                    self.db,
                    faq_id=str(updated.question_id) if updated.question_id else str(updated.id),
                    event_type="DISCUSSION_SYNTHESIZED",
                    description=(
                        f"Auto-synthesis on accepted reply: '{updated.title}' "
                        f"(consensus {breakdown.score}, confidence {candidate.confidence_score}%)"
                    ),
                    triggered_by=user_id,
                )
            except Exception as err:
                import logging
                logging.getLogger(__name__).warning(
                    "[DiscussionService] accept-reply post-hooks failed: %s", err
                )

        return DiscussionResponse.model_validate(updated)
