from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: Optional[str] = None
    technologies: List[str] = []
    repo_url: Optional[str] = None
    live_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
