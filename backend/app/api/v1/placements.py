from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.core.dependencies import require_admin_user, get_optional_user
from app.schemas.placement import (
    PlacementCreate, PlacementUpdate, PlacementResponse,
    AchievementCreate, AchievementResponse
)
from app.services.placement_service import PlacementService

router = APIRouter()

@router.get("", response_model=List[PlacementResponse], summary="List placements")
async def list_placements(
    search: Optional[str] = Query(None, description="Search company or role"),
    location: Optional[str] = Query(None, description="Filter by location"),
    status: Optional[str] = Query(None, description="Filter by status (active/closed)"),
    db: AsyncSession = Depends(get_db)
):
    return await PlacementService.list_placements(db, search=search, location=location, status=status)

@router.get("/achievements", response_model=List[AchievementResponse], summary="List achievements and hackathon wins")
async def list_achievements(db: AsyncSession = Depends(get_db)):
    return await PlacementService.list_achievements(db)

@router.get("/{id}", response_model=PlacementResponse, summary="Get placement details")
async def get_placement(id: UUID, db: AsyncSession = Depends(get_db)):
    return await PlacementService.get_placement(db, id)

@router.post("", response_model=PlacementResponse, status_code=status.HTTP_201_CREATED, summary="Create placement opportunity")
async def create_placement(
    p_in: PlacementCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    student_id = UUID(current_user["id"]) if current_user and current_user.get("id") else None
    return await PlacementService.create_placement(db, p_in, student_id=student_id)

@router.put("/{id}", response_model=PlacementResponse, summary="Update placement (Admin)")
async def update_placement(
    id: UUID,
    p_in: PlacementUpdate,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    return await PlacementService.update_placement(db, id, p_in)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete placement (Admin)")
async def delete_placement(
    id: UUID,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    await PlacementService.delete_placement(db, id)
    return None

@router.post("/achievements", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED, summary="Add achievement")
async def create_achievement(
    ach_in: AchievementCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    student_id = UUID(current_user["id"]) if current_user and current_user.get("id") else None
    return await PlacementService.create_achievement(db, ach_in, student_id=student_id)
