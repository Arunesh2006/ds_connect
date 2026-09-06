from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.placement import Placement, Achievement
from app.schemas.placement import PlacementCreate, PlacementUpdate, AchievementCreate

class PlacementService:
    @staticmethod
    async def list_placements(db: AsyncSession, search: Optional[str] = None, location: Optional[str] = None, status: Optional[str] = None) -> List[Placement]:
        query = select(Placement)
        if search:
            query = query.where(Placement.company.ilike(f"%{search}%") | Placement.role.ilike(f"%{search}%"))
        if location:
            query = query.where(Placement.location.ilike(f"%{location}%"))
        if status:
            query = query.where(Placement.status == status)

        query = query.order_by(Placement.created_at.desc())
        res = await db.execute(query)
        return res.scalars().all()

    @staticmethod
    async def get_placement(db: AsyncSession, placement_id: UUID) -> Optional[Placement]:
        res = await db.execute(select(Placement).where(Placement.id == placement_id))
        return res.scalar_one_or_none()

    @staticmethod
    async def create_placement(db: AsyncSession, p_in: PlacementCreate, student_id: Optional[UUID] = None) -> Placement:
        new_p = Placement(
            student_id=student_id,
            company=p_in.company,
            role=p_in.role,
            package_lpa=p_in.package_lpa,
            placement_year=p_in.placement_year,
            eligibility=p_in.eligibility,
            skills=p_in.skills or [],
            location=p_in.location or "Hybrid",
            application_deadline=p_in.application_deadline,
            application_link=p_in.application_link,
            description=p_in.description,
            status=p_in.status or "active",
            is_verified=True,
            consent_for_public_display=p_in.consent_for_public_display
        )
        db.add(new_p)
        await db.commit()
        await db.refresh(new_p)
        return new_p

    @staticmethod
    async def update_placement(db: AsyncSession, placement_id: UUID, p_in: PlacementUpdate) -> Placement:
        res = await db.execute(select(Placement).where(Placement.id == placement_id))
        p = res.scalar_one_or_none()
        if not p:
            raise HTTPException(status_code=404, detail="Placement not found")

        data = p_in.model_dump(exclude_unset=True)
        for k, v in data.items():
            setattr(p, k, v)

        await db.commit()
        await db.refresh(p)
        return p

    @staticmethod
    async def delete_placement(db: AsyncSession, placement_id: UUID) -> bool:
        res = await db.execute(select(Placement).where(Placement.id == placement_id))
        p = res.scalar_one_or_none()
        if not p:
            raise HTTPException(status_code=404, detail="Placement not found")

        await db.delete(p)
        await db.commit()
        return True

    @staticmethod
    async def list_achievements(db: AsyncSession) -> List[Achievement]:
        res = await db.execute(select(Achievement).order_by(Achievement.achievement_date.desc()))
        return res.scalars().all()

    @staticmethod
    async def create_achievement(db: AsyncSession, ach_in: AchievementCreate, student_id: Optional[UUID] = None) -> Achievement:
        new_ach = Achievement(
            student_id=student_id,
            category=ach_in.category,
            title=ach_in.title,
            description=ach_in.description,
            achievement_date=ach_in.achievement_date,
            certificate_url=ach_in.certificate_url
        )
        db.add(new_ach)
        await db.commit()
        await db.refresh(new_ach)
        return new_ach
