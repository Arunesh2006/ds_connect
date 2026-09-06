from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.core.dependencies import require_admin_user, get_optional_user
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.project_service import ProjectService

router = APIRouter()

@router.get("", response_model=List[ProjectResponse], summary="List project showcase")
async def list_projects(
    search: Optional[str] = Query(None, description="Search by title or description"),
    technology: Optional[str] = Query(None, description="Filter by technology tag"),
    status: Optional[str] = Query("approved", description="Filter by status"),
    db: AsyncSession = Depends(get_db)
):
    return await ProjectService.list_projects(db, search=search, technology=technology, status=status)

@router.get("/admin/all", response_model=List[ProjectResponse], summary="List all projects for admin review")
async def list_all_projects_admin(
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    return await ProjectService.list_all_for_admin(db)

@router.get("/{id}", response_model=ProjectResponse, summary="Get project details")
async def get_project(id: UUID, db: AsyncSession = Depends(get_db)):
    return await ProjectService.get_project(db, id)

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED, summary="Submit project")
async def create_project(
    p_in: ProjectCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    owner_id = UUID(current_user["id"]) if current_user and current_user.get("id") else None
    return await ProjectService.create_project(db, p_in, owner_id=owner_id)

@router.put("/{id}", response_model=ProjectResponse, summary="Update / Approve project (Admin)")
async def update_project(
    id: UUID,
    p_in: ProjectUpdate,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    return await ProjectService.update_project(db, id, p_in)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete project (Admin)")
async def delete_project(
    id: UUID,
    admin: dict = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db)
):
    await ProjectService.delete_project(db, id)
    return None
