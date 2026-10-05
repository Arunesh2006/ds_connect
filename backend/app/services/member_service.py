from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.profile import Profile
from app.schemas.member import MemberCreate, MemberUpdate

class MemberService:
    @staticmethod
    async def list_members(
        db: AsyncSession,
        search: Optional[str] = None,
        section: Optional[str] = None,
        year: Optional[int] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Profile]:
        query = select(Profile)
        if search:
            query = query.where(Profile.name.ilike(f"%{search}%") | Profile.responsibility.ilike(f"%{search}%"))
        if section:
            query = query.where(Profile.responsibility.ilike(f"%{section}%"))
        if year:
            query = query.where(Profile.college_year == year)
            
        query = query.order_by(
            Profile.role.asc(),
            Profile.college_year.desc().nullslast(),
            Profile.name.asc()
        ).limit(limit).offset(offset)
        res = await db.execute(query)
        return res.scalars().all()

    @staticmethod
    async def get_member(db: AsyncSession, member_id: UUID) -> Optional[Profile]:
        res = await db.execute(select(Profile).where(Profile.id == member_id))
        return res.scalar_one_or_none()

    @staticmethod
    async def create_member(db: AsyncSession, member_in: MemberCreate) -> Profile:
        res = await db.execute(select(Profile).where(Profile.email == member_in.email))
        if res.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        college_year = member_in.college_year
        if member_in.role == "faculty":
            college_year = None
        elif member_in.role == "student" and (college_year is None or college_year < 1 or college_year > 5):
            college_year = 2

        new_profile = Profile(
            name=member_in.name,
            email=member_in.email,
            role=member_in.role,
            college_year=college_year,
            responsibility=member_in.responsibility or "Data Science",
            bio=member_in.bio or f"{member_in.role.capitalize()} member at DS-Connect.",
            skills=member_in.skills or ["Data Science"],
            github_handle=member_in.github_handle,
            linkedin_url=member_in.linkedin_url,
            avatar_url=member_in.avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={member_in.name.replace(' ', '')}"
        )
        db.add(new_profile)
        await db.commit()
        await db.refresh(new_profile)
        return new_profile

    @staticmethod
    async def update_member(db: AsyncSession, member_id: UUID, update_in: MemberUpdate) -> Profile:
        res = await db.execute(select(Profile).where(Profile.id == member_id))
        profile = res.scalar_one_or_none()
        if not profile:
            raise HTTPException(status_code=404, detail="Member not found")

        data = update_in.model_dump(exclude_unset=True)
        for k, v in data.items():
            setattr(profile, k, v)

        await db.commit()
        await db.refresh(profile)
        return profile

    @staticmethod
    async def delete_member(db: AsyncSession, member_id: UUID) -> bool:
        res = await db.execute(select(Profile).where(Profile.id == member_id))
        profile = res.scalar_one_or_none()
        if not profile:
            raise HTTPException(status_code=404, detail="Member not found")

        await db.delete(profile)
        await db.commit()
        return True
