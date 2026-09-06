from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.profile import Profile
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.core.security import get_optional_user

router = APIRouter()

DEFAULT_USER_ID = UUID("00000000-0000-0000-0000-000000000002")  # Aarav Sharma default

@router.get("/me", response_model=ProfileResponse, summary="Get current student profile")
async def get_my_profile(
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns profile for currently authenticated student or active default."""
    user_id = UUID(current_user["id"]) if current_user else DEFAULT_USER_ID
    res = await db.execute(select(Profile).where(Profile.id == user_id))
    profile = res.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=ProfileResponse, summary="Update student profile")
async def update_my_profile(
    profile_in: ProfileUpdate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Update profile bio, skills, college year, and social links."""
    user_id = UUID(current_user["id"]) if current_user else DEFAULT_USER_ID
    res = await db.execute(select(Profile).where(Profile.id == user_id))
    profile = res.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return profile

@router.get("", response_model=List[ProfileResponse], summary="List cohort members directory")
async def list_cohort_members(db: AsyncSession = Depends(get_db)):
    """List all students and team members in the Data Science cohort."""
    res = await db.execute(select(Profile).order_by(Profile.college_year.desc(), Profile.name.asc()))
    return res.scalars().all()
