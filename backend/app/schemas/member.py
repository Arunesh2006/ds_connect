from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class MemberBase(BaseModel):
    name: str = Field(..., min_length=2, example="Lakshya Saini")
    email: str = Field(..., example="lakshya@dsconnect.edu")
    role: str = Field(default="student", example="student")
    college_year: Optional[int] = Field(default=2, example=2)
    responsibility: Optional[str] = Field(default="Data Science", example="Data Science")
    bio: Optional[str] = None
    skills: List[str] = []
    github_handle: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None

class MemberCreate(MemberBase):
    pass

class MemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    college_year: Optional[int] = None
    responsibility: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    github_handle: Optional[str] = None
    linkedin_url: Optional[str] = None

class MemberResponse(MemberBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
