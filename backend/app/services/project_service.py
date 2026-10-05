from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

class ProjectService:
    @staticmethod
    async def list_projects(
        db: AsyncSession,
        search: Optional[str] = None,
        technology: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Project]:
        query = select(Project)
        if search:
            query = query.where(Project.title.ilike(f"%{search}%") | Project.description.ilike(f"%{search}%"))
        if status and status != "all":
            query = query.where(Project.status == status)
        else:
            # By default show approved projects to students
            query = query.where(Project.status == "approved")

        if technology and technology != "all":
            query = query.where(Project.technologies.any(technology))

        query = query.order_by(Project.created_at.desc()).limit(limit).offset(offset)
        res = await db.execute(query)
        return res.scalars().all()

    @staticmethod
    async def list_all_for_admin(db: AsyncSession) -> List[Project]:
        res = await db.execute(select(Project).order_by(Project.created_at.desc()))
        return res.scalars().all()

    @staticmethod
    async def get_project(db: AsyncSession, project_id: UUID) -> Optional[Project]:
        res = await db.execute(select(Project).where(Project.id == project_id))
        return res.scalar_one_or_none()

    @staticmethod
    async def create_project(db: AsyncSession, p_in: ProjectCreate, owner_id: Optional[UUID] = None) -> Project:
        new_p = Project(
            title=p_in.title,
            description=p_in.description,
            technologies=p_in.technologies or [],
            repo_url=p_in.repo_url,
            live_url=p_in.live_url,
            owner_id=owner_id,
            status=p_in.status or "approved"
        )
        db.add(new_p)
        await db.commit()
        await db.refresh(new_p)
        return new_p

    @staticmethod
    async def update_project(db: AsyncSession, project_id: UUID, p_in: ProjectUpdate) -> Project:
        res = await db.execute(select(Project).where(Project.id == project_id))
        p = res.scalar_one_or_none()
        if not p:
            raise HTTPException(status_code=404, detail="Project not found")

        data = p_in.model_dump(exclude_unset=True)
        for k, v in data.items():
            setattr(p, k, v)

        await db.commit()
        await db.refresh(p)
        return p

    @staticmethod
    async def delete_project(db: AsyncSession, project_id: UUID) -> bool:
        res = await db.execute(select(Project).where(Project.id == project_id))
        p = res.scalar_one_or_none()
        if not p:
            raise HTTPException(status_code=404, detail="Project not found")

        await db.delete(p)
        await db.commit()
        return True
