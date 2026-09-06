from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.placement import Placement, Achievement
from app.schemas.placement import PlacementCreate, PlacementResponse, AchievementCreate, AchievementResponse
from app.core.security import get_optional_user

router = APIRouter()

DEFAULT_USER_ID = UUID("00000000-0000-0000-0000-000000000002")

@router.get("", response_model=List[PlacementResponse], summary="List verified cohort placements")
async def list_placements(db: AsyncSession = Depends(get_db)):
    """List placements that have public consent enabled under DPDP Act."""
    query = select(Placement).where(Placement.consent_for_public_display == True).order_by(Placement.placement_year.desc())
    res = await db.execute(query)
    return res.scalars().all()

@router.post("", response_model=PlacementResponse, status_code=status.HTTP_201_CREATED, summary="Record placement")
async def create_placement(
    placement_in: PlacementCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Record student placement data."""
    user_id = UUID(current_user["id"]) if current_user else None
    new_placement = Placement(
        student_id=user_id,
        company=placement_in.company,
        role=placement_in.role,
        package_lpa=placement_in.package_lpa,
        placement_year=placement_in.placement_year,
        is_verified=True,
        consent_for_public_display=placement_in.consent_for_public_display
    )
    db.add(new_placement)
    await db.commit()
    await db.refresh(new_placement)
    return new_placement

@router.get("/achievements", response_model=List[AchievementResponse], summary="List student achievements")
async def list_achievements(db: AsyncSession = Depends(get_db)):
    """List hackathon awards and certifications."""
    query = select(Achievement).order_by(Achievement.achievement_date.desc())
    res = await db.execute(query)
    return res.scalars().all()

@router.post("/achievements", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED, summary="Add achievement")
async def create_achievement(
    achievement_in: AchievementCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Record hackathon win or certification."""
    user_id = UUID(current_user["id"]) if current_user else None
    new_ach = Achievement(
        student_id=user_id,
        category=achievement_in.category,
        title=achievement_in.title,
        description=achievement_in.description,
        achievement_date=achievement_in.achievement_date,
        certificate_url=achievement_in.certificate_url
    )
    db.add(new_ach)
    await db.commit()
    await db.refresh(new_ach)
    return new_ach
