from uuid import UUID
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.opportunity import Opportunity
from app.schemas.opportunity import OpportunityCreate, OpportunityResponse
from app.core.security import get_optional_user
from app.tasks.scrapers.sync_runner import run_all_scrapers

router = APIRouter()

DEFAULT_ADMIN_ID = UUID("00000000-0000-0000-0000-000000000001")

@router.get("", response_model=List[OpportunityResponse], summary="List opportunities")
async def list_opportunities(
    type: Optional[str] = Query(None, description="Filter by type (hackathon, event, internship)"),
    status: str = Query("published", description="Filter by status"),
    search: Optional[str] = Query(None, description="Search term in title"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve published opportunities with optional filtering and search."""
    query = select(Opportunity).where(Opportunity.status == status)
    
    if type and type != "all":
        query = query.where(Opportunity.type == type)
    if search:
        query = query.where(Opportunity.title.ilike(f"%{search}%"))
        
    query = query.order_by(Opportunity.deadline.asc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/sync", summary="Trigger automated opportunity scraper")
async def trigger_scraper_sync() -> Dict[str, Any]:
    """
    Executes the scraper engine to discover and ingest new hackathons
    and competitions from Devpost, Kaggle, and open feeds.
    Deduplicates automatically.
    """
    result = await run_all_scrapers()
    return result

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
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit a new opportunity."""
    user_id = UUID(current_user["id"]) if current_user else None

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
        submitted_by=user_id
    )
    db.add(new_opp)
    await db.commit()
    await db.refresh(new_opp)
    return new_opp
