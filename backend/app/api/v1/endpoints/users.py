from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.profile import Profile
from app.schemas.profile import ProfileResponse, ProfileUpdate, ProfileCreate
from app.core.security import get_optional_user

router = APIRouter()

DEFAULT_USER_ID = UUID("00000000-0000-0000-0000-000000000002")

@router.get("/me", response_model=Optional[ProfileResponse], summary="Get current user profile")
async def get_my_profile(
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns profile for currently authenticated user, or first profile in database."""
    user_id = UUID(current_user["id"]) if current_user else None
    if user_id:
        res = await db.execute(select(Profile).where(Profile.id == user_id))
        profile = res.scalar_one_or_none()
        if profile:
            return profile

    # Fallback to first profile in directory
    res = await db.execute(select(Profile).limit(1))
    return res.scalar_one_or_none()

@router.put("/me", response_model=ProfileResponse, summary="Update student profile")
async def update_my_profile(
    profile_in: ProfileUpdate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Update profile bio, skills, college year, responsibility, and social links."""
    user_id = UUID(current_user["id"]) if current_user else None
    if user_id:
        res = await db.execute(select(Profile).where(Profile.id == user_id))
        profile = res.scalar_one_or_none()
    else:
        res = await db.execute(select(Profile).limit(1))
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
    """List all students and faculty members in the Data Science cohort."""
    res = await db.execute(
        select(Profile).order_by(
            Profile.role.asc(), # 'faculty' before 'student'
            Profile.college_year.desc().nullslast(),
            Profile.name.asc()
        )
    )
    return res.scalars().all()

@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED, summary="Add new cohort member")
async def create_cohort_member(
    member_in: ProfileCreate,
    db: AsyncSession = Depends(get_db)
):
    """Add a new student or college faculty member with their assigned section responsibility."""
    res = await db.execute(select(Profile).where(Profile.email == member_in.email))
    existing = res.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A member with this email address already exists"
        )

    # For faculty, college_year is None. For students, enforce between 1 and 5.
    college_year = member_in.college_year
    if member_in.role == "faculty":
        college_year = None
    elif member_in.role == "student":
        if college_year is None or college_year < 1 or college_year > 5:
            college_year = 3

    avatar = member_in.avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={member_in.name.replace(' ', '')}"

    new_profile = Profile(
        name=member_in.name,
        email=member_in.email,
        role=member_in.role,
        college_year=college_year,
        responsibility=member_in.responsibility,
        bio=member_in.bio,
        skills=member_in.skills or [],
        github_handle=member_in.github_handle,
        linkedin_url=member_in.linkedin_url,
        avatar_url=avatar
    )
    db.add(new_profile)
    await db.commit()
    await db.refresh(new_profile)
    return new_profile

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete cohort member")
async def delete_cohort_member(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Remove a member from the cohort directory."""
    res = await db.execute(select(Profile).where(Profile.id == id))
    profile = res.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    await db.delete(profile)
    await db.commit()
    return None
