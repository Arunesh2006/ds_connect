from uuid import UUID
from datetime import datetime, date
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field

class PlacementBase(BaseModel):
    company: str = Field(..., min_length=2)
    role: str = Field(..., min_length=2)
    package_lpa: Optional[Decimal] = None
    placement_year: int
    consent_for_public_display: bool = True

class PlacementCreate(PlacementBase):
    pass

class PlacementResponse(PlacementBase):
    id: UUID
    student_id: UUID
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AchievementBase(BaseModel):
    category: str
    title: str
    description: Optional[str] = None
    achievement_date: date
    certificate_url: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class AchievementResponse(AchievementBase):
    id: UUID
    student_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
