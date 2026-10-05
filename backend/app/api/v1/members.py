from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.core.dependencies import require_admin_user
from app.schemas.member import MemberCreate, MemberUpdate, MemberResponse
from app.services.member_service import MemberService

router = APIRouter()

@router.get("", response_model=List[MemberResponse], summary="List cohort members")
async def list_members(
    search: Optional[str] = Query(None, description="Search by name or working section"),
    section: Optional[str] = Query(None, description="Filter by working section"),
    year: Optional[int] = Query(None, description="Filter by college year"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    offset: int = Query(0, ge=0, description="Page offset"),
    db: AsyncSession = Depends(get_db)
):
    return await MemberService.list_members(db, search=search, section=section, year=year, limit=limit, offset=offset)

@router.get("/{id}", response_model=MemberResponse, summary="Get member details")
async def get_member(id: UUID, db: AsyncSession = Depends(get_db)):
    return await MemberService.get_member(db, id)

@router.post("", response_model=MemberResponse, status_code=status.HTTP_201_CREATED, summary="Add member (Admin)")
async def create_member(
    member_in: MemberCreate,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    return await MemberService.create_member(db, member_in)

@router.put("/{id}", response_model=MemberResponse, summary="Update member (Admin)")
async def update_member(
    id: UUID,
    member_in: MemberUpdate,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    return await MemberService.update_member(db, id, member_in)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remove member (Admin)")
async def delete_member(
    id: UUID,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    await MemberService.delete_member(db, id)
    return None
