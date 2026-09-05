from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.db.session import get_db
from app.models.opportunity import Opportunity
from app.schemas.opportunity import OpportunityCreate, OpportunityResponse, OpportunityUpdate
from app.core.security import get_current_user

router = APIRouter()

@router.get("", response_model=List[OpportunityResponse], summary="List opportunities")
async def list_opportunities(
    type: Optional[str] = Query(None, description="Filter by type (hackathon, event, internship)"),
    status: str = Query("published", description="Filter by status"),
    search: Optional[str] = Query(None, description="Search term in title"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve published opportunities with optional filtering and pagination."""
    query = select(Opportunity).where(Opportunity.status == status)
    
    if type:
        query = query.where(Opportunity.type == type)
    if search:
        query = query.where(Opportunity.title.ilike(f"%{search}%"))
        
    query = query.order_by(Opportunity.deadline.asc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=OpportunityResponse, summary="Get opportunity details")
async def get_opportunity(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Fetch details of a specific opportunity by UUID."""
    query = select(Opportunity).where(Opportunity.id == id)
    result = await db.execute(query)
    opp = result.scalar_one_or_none()
    
    if not opp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found"
        )
    return opp

@router.post("", response_model=OpportunityResponse, status_code=status.HTTP_201_CREATED, summary="Create opportunity")
async def create_opportunity(
    opportunity_in: OpportunityCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit a new opportunity. Requires Supabase authentication."""
    new_opp = Opportunity(
        title=opportunity_in.title,
        description=opportunity_in.description,
        type=opportunity_in.type,
        status=opportunity_in.status or "published",
        organizer=opportunity_in.organizer,
        deadline=opportunity_in.deadline,
        location=opportunity_in.location,
        external_link=opportunity_in.external_link,
        tags=opportunity_in.tags,
        submitted_by=UUID(current_user["id"])
    )
    db.add(new_opp)
    await db.commit()
    await db.refresh(new_opp)
    return new_opp
