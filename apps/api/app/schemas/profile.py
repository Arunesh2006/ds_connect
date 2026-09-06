from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class ProfileBase(BaseModel):
    name: str
    email: str

    avatar_url: Optional[str] = None
    college_year: Optional[int] = None
    role: str = "student"
    responsibility: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = []
    github_handle: Optional[str] = None
    linkedin_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    college_year: Optional[int] = None
    responsibility: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    github_handle: Optional[str] = None
    linkedin_url: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
