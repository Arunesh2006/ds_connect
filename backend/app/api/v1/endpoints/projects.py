from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse
from app.core.security import get_optional_user

router = APIRouter()

DEFAULT_USER_ID = UUID("00000000-0000-0000-0000-000000000002")

@router.get("", response_model=List[ProjectResponse], summary="List cohort projects")
async def list_projects(
    search: Optional[str] = Query(None, description="Search by title"),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Fetch student and cohort Data Science projects."""
    query = select(Project)
    if search:
        query = query.where(Project.title.ilike(f"%{search}%"))
    query = query.order_by(Project.created_at.desc()).limit(limit)
    res = await db.execute(query)
    return res.scalars().all()

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED, summary="Add student project")
async def create_project(
    project_in: ProjectCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Publish a project showcase."""
    user_id = UUID(current_user["id"]) if current_user else None
    new_proj = Project(
        title=project_in.title,
        description=project_in.description,
        technologies=project_in.technologies,
        repo_url=project_in.repo_url,
        live_url=project_in.live_url,
        owner_id=user_id
    )
    db.add(new_proj)
    await db.commit()
    await db.refresh(new_proj)
    return new_proj
