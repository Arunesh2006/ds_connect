from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=150, example="AI Resume Analyzer")
    description: Optional[str] = Field(None, example="NLP pipeline analyzing student resumes against JD requirements.")
    technologies: List[str] = Field(default_factory=list, example=["Python", "FastAPI", "NLP", "React"])
    repo_url: Optional[str] = Field(None, example="https://github.com/dsconnect/resume-analyzer")
    live_url: Optional[str] = Field(None, example="https://resume-analyzer.dsconnect.edu")
    status: str = Field(default="approved", example="approved")

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    repo_url: Optional[str] = None
    live_url: Optional[str] = None
    status: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: UUID
    owner_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
