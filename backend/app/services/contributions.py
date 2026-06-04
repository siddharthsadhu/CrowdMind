import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.discussion import Discussion, Reply
from app.models.question import Question
from app.models.faq import PublishedFaq, FaqVersion
from app.schemas.contributions import ContributionItem, ContributionsResponse, ContributionSummary


class ContributionService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_contributions(self, user_id: str) -> ContributionsResponse:
        uid = uuid.UUID(user_id)

        q_count = await self.session.scalar(
            select(func.count()).select_from(Question).where(
                Question.user_id == uid, Question.deleted_at.is_(None)
            )
        ) or 0
        r_count = await self.session.scalar(
            select(func.count()).select_from(Reply).where(
                Reply.user_id == uid, Reply.deleted_at.is_(None)
            )
        ) or 0
        d_count = await self.session.scalar(
            select(func.count()).select_from(Discussion).where(
                Discussion.created_by == uid, Discussion.deleted_at.is_(None)
            )
        ) or 0
        f_count = await self.session.scalar(
            select(func.count()).select_from(PublishedFaq).where(
                PublishedFaq.published_by == uid, PublishedFaq.deleted_at.is_(None)
            )
        ) or 0
        v_count = await self.session.scalar(
            select(func.count()).select_from(FaqVersion).where(FaqVersion.created_by == uid)
        ) or 0

        items: list[ContributionItem] = []

        q_rows = (await self.session.execute(
            select(Question).where(Question.user_id == uid, Question.deleted_at.is_(None))
            .order_by(Question.created_at.desc())
        )).scalars().all()
        for q in q_rows:
            items.append(ContributionItem(
                type="question",
                id=str(q.id),
                title=q.title,
                snippet=(q.description or "")[:160] if q.description else None,
                url=f"/analysis/{q.id}",
                status=q.status,
                created_at=q.created_at,
            ))

        r_rows = (await self.session.execute(
            select(Reply).where(Reply.user_id == uid, Reply.deleted_at.is_(None))
            .order_by(Reply.created_at.desc())
        )).scalars().all()
        discussion_titles: dict[str, str] = {}
        if r_rows:
            disc_ids = list({r.discussion_id for r in r_rows})
            d_titles = (await self.session.execute(
                select(Discussion.id, Discussion.title).where(Discussion.id.in_(disc_ids))
            )).all()
            for d_id, d_title in d_titles:
                discussion_titles[str(d_id)] = d_title
        for r in r_rows:
            items.append(ContributionItem(
                type="reply",
                id=str(r.id),
                title=(r.content or "")[:60] + ("..." if r.content and len(r.content) > 60 else ""),
                snippet=(r.content or "")[:160] if r.content else None,
                url=f"/discussions/{r.discussion_id}",
                status="ACCEPTED" if r.is_accepted else None,
                created_at=r.created_at,
                parent_id=str(r.discussion_id),
                parent_title=discussion_titles.get(str(r.discussion_id)),
            ))

        d_rows = (await self.session.execute(
            select(Discussion).where(Discussion.created_by == uid, Discussion.deleted_at.is_(None))
            .order_by(Discussion.created_at.desc())
        )).scalars().all()
        for d in d_rows:
            items.append(ContributionItem(
                type="discussion",
                id=str(d.id),
                title=d.title,
                snippet=(d.description or "")[:160] if d.description else None,
                url=f"/discussions/{d.id}",
                status=d.status,
                created_at=d.created_at,
            ))

        f_rows = (await self.session.execute(
            select(PublishedFaq).where(PublishedFaq.published_by == uid, PublishedFaq.deleted_at.is_(None))
            .order_by(PublishedFaq.published_at.desc())
        )).scalars().all()
        for f in f_rows:
            items.append(ContributionItem(
                type="faq",
                id=str(f.id),
                title=f.title,
                snippet=(f.content or "")[:160] if f.content else None,
                url=f"/faq/{f.id}",
                status=f"v{f.version_number}",
                created_at=f.published_at,
            ))

        v_rows = (await self.session.execute(
            select(FaqVersion).where(FaqVersion.created_by == uid)
            .order_by(FaqVersion.created_at.desc())
        )).scalars().all()
        faq_titles: dict[str, str] = {}
        if v_rows:
            f_ids = list({v.faq_id for v in v_rows})
            f_titles = (await self.session.execute(
                select(PublishedFaq.id, PublishedFaq.title).where(PublishedFaq.id.in_(f_ids))
            )).all()
            for fid, ft in f_titles:
                faq_titles[str(fid)] = ft
        for v in v_rows:
            items.append(ContributionItem(
                type="faq_version",
                id=str(v.id),
                title=f"{v.title} (v{v.version_number})",
                snippet=(v.content or "")[:160] if v.content else None,
                url=f"/faq/{v.faq_id}",
                status=f"v{v.version_number}",
                created_at=v.created_at,
                parent_id=str(v.faq_id),
                parent_title=faq_titles.get(str(v.faq_id)),
            ))

        items.sort(key=lambda x: x.created_at or 0, reverse=True)

        return ContributionsResponse(
            items=items,
            summary=ContributionSummary(
                questions=q_count,
                replies=r_count,
                discussions=d_count,
                faqs_published=f_count,
                faq_versions=v_count,
                total=len(items),
            ),
        )
