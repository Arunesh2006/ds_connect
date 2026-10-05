from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.opportunity import Opportunity
from app.schemas.hackathon import HackathonCreate, HackathonUpdate

class HackathonService:
    @staticmethod
    async def list_hackathons(
        db: AsyncSession,
        search: Optional[str] = None,
        mode: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Opportunity]:
        query = select(Opportunity).where(Opportunity.type == "hackathon")
        if search:
            query = query.where(Opportunity.title.ilike(f"%{search}%") | Opportunity.organizer.ilike(f"%{search}%"))
        if mode and mode != "all":
            query = query.where(Opportunity.mode.ilike(f"%{mode}%"))
        if status and status != "all":
            query = query.where(Opportunity.status == status)

        query = query.order_by(Opportunity.deadline.asc()).limit(limit).offset(offset)
        res = await db.execute(query)
        return res.scalars().all()

    @staticmethod
    async def get_hackathon(db: AsyncSession, hackathon_id: UUID) -> Optional[Opportunity]:
        res = await db.execute(select(Opportunity).where(Opportunity.id == hackathon_id, Opportunity.type == "hackathon"))
        return res.scalar_one_or_none()

    @staticmethod
    async def create_hackathon(db: AsyncSession, h_in: HackathonCreate, submitted_by: Optional[UUID] = None) -> Opportunity:
        new_h = Opportunity(
            title=h_in.title,
            organizer=h_in.organizer,
            description=h_in.description,
            type="hackathon",
            status=h_in.status or "published",
            deadline=h_in.deadline,
            location=h_in.location or "Online",
            external_link=h_in.external_link,
            tags=h_in.tags or [],
            prize_pool=h_in.prize_pool or "$50,000 USD",
            start_date=h_in.start_date,
            end_date=h_in.end_date,
            mode=h_in.mode or "Online",
            team_size=h_in.team_size or "1-4",
            submitted_by=submitted_by
        )
        db.add(new_h)
        await db.commit()
        await db.refresh(new_h)
        return new_h

    @staticmethod
    async def update_hackathon(db: AsyncSession, hackathon_id: UUID, h_in: HackathonUpdate) -> Opportunity:
        res = await db.execute(select(Opportunity).where(Opportunity.id == hackathon_id))
        h = res.scalar_one_or_none()
        if not h:
            raise HTTPException(status_code=404, detail="Hackathon not found")

        data = h_in.model_dump(exclude_unset=True)
        for k, v in data.items():
            setattr(h, k, v)

        await db.commit()
        await db.refresh(h)
        return h

    @staticmethod
    async def delete_hackathon(db: AsyncSession, hackathon_id: UUID) -> bool:
        res = await db.execute(select(Opportunity).where(Opportunity.id == hackathon_id))
        h = res.scalar_one_or_none()
        if not h:
            raise HTTPException(status_code=404, detail="Hackathon not found")

        await db.delete(h)
        await db.commit()
        return True
