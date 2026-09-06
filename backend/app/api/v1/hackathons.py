from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.core.dependencies import require_admin_user, get_optional_user
from app.schemas.hackathon import HackathonCreate, HackathonUpdate, HackathonResponse
from app.services.hackathon_service import HackathonService

router = APIRouter()

@router.get("", response_model=List[HackathonResponse], summary="List hackathons")
async def list_hackathons(
    search: Optional[str] = Query(None, description="Search by title or organizer"),
    mode: Optional[str] = Query(None, description="Filter by mode: Online, In-Person, Hybrid"),
    status: Optional[str] = Query(None, description="Filter by status: published, closed"),
    db: AsyncSession = Depends(get_db)
):
    return await HackathonService.list_hackathons(db, search=search, mode=mode, status=status)

@router.get("/{id}", response_model=HackathonResponse, summary="Get hackathon details")
async def get_hackathon(id: UUID, db: AsyncSession = Depends(get_db)):
    return await HackathonService.get_hackathon(db, id)

@router.post("", response_model=HackathonResponse, status_code=status.HTTP_201_CREATED, summary="Post hackathon (Admin)")
async def create_hackathon(
    h_in: HackathonCreate,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    submitted_by = UUID(admin["id"]) if admin.get("id") else None
    return await HackathonService.create_hackathon(db, h_in, submitted_by=submitted_by)

@router.put("/{id}", response_model=HackathonResponse, summary="Update hackathon (Admin)")
async def update_hackathon(
    id: UUID,
    h_in: HackathonUpdate,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    return await HackathonService.update_hackathon(db, id, h_in)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete hackathon (Admin)")
async def delete_hackathon(
    id: UUID,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    await HackathonService.delete_hackathon(db, id)
    return None
