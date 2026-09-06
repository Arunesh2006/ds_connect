from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.team_request import TeamRequest
from app.schemas.team_request import TeamRequestCreate, TeamRequestResponse
from app.core.security import get_optional_user

router = APIRouter()

DEFAULT_USER_ID = UUID("00000000-0000-0000-0000-000000000002")  # Aarav Sharma default

@router.get("", response_model=List[TeamRequestResponse], summary="List team requests")
async def list_team_requests(
    opportunity_id: Optional[UUID] = Query(None, description="Filter by opportunity"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Fetch active team formation requests."""
    query = select(TeamRequest)
    if opportunity_id:
        query = query.where(TeamRequest.opportunity_id == opportunity_id)
        
    query = query.order_by(TeamRequest.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=TeamRequestResponse, status_code=status.HTTP_201_CREATED, summary="Create team request")
async def create_team_request(
    request_in: TeamRequestCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Post a new teammate search request."""
    user_id = UUID(current_user["id"]) if current_user else None

    new_req = TeamRequest(
        opportunity_id=request_in.opportunity_id,
        requester_id=user_id,
        title=request_in.title,
        role_needed=request_in.role_needed,
        skills_required=request_in.skills_required,
        max_members=request_in.max_members,
        current_members_count=1,
        status="pending"
    )
    db.add(new_req)
    await db.commit()
    await db.refresh(new_req)
    return new_req
