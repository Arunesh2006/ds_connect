from uuid import UUID
from datetime import datetime, date
from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel, Field

class PlacementBase(BaseModel):
    company: str = Field(..., min_length=2, example="Google")
    role: str = Field(..., min_length=2, example="Software Engineering Intern")
    package_lpa: Optional[Decimal] = Field(None, example=24.5)
    placement_year: int = Field(default=2026, example=2026)
    eligibility: Optional[str] = Field(None, example="Pre-final Year B.Tech")
    skills: List[str] = Field(default_factory=list, example=["Python", "SQL", "ML"])
    location: str = Field(default="Hybrid", example="Bangalore")
    application_deadline: Optional[datetime] = None
    application_link: Optional[str] = None
    description: Optional[str] = None
    status: str = Field(default="active", example="active")
    consent_for_public_display: bool = True

class PlacementCreate(PlacementBase):
    pass

class PlacementUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    package_lpa: Optional[Decimal] = None
    placement_year: Optional[int] = None
    eligibility: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    application_deadline: Optional[datetime] = None
    application_link: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    consent_for_public_display: Optional[bool] = None

class PlacementResponse(PlacementBase):
    id: UUID
    student_id: Optional[UUID] = None
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AchievementBase(BaseModel):
    category: str = Field(..., example="Hackathon Win")
    title: str = Field(..., example="1st Place - Smart India Hackathon")
    description: Optional[str] = None
    achievement_date: date
    certificate_url: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class AchievementResponse(AchievementBase):
    id: UUID
    student_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True
