from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class HackathonBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=150, example="Kaggle AI Olympiad 2026")
    organizer: str = Field(..., example="Google & Kaggle")
    description: str = Field(..., min_length=10, example="Global machine learning competition on foundation models.")
    deadline: datetime = Field(..., example="2026-10-31T23:59:59Z")
    location: str = Field(default="Online", example="Online")
    external_link: Optional[str] = Field(None, example="https://kaggle.com/competitions")
    tags: List[str] = Field(default_factory=list, example=["Machine Learning", "PyTorch", "NLP"])
    prize_pool: Optional[str] = Field(default="$50,000 USD", example="$50,000 USD")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    mode: str = Field(default="Online", example="Online")
    team_size: str = Field(default="1-4", example="1-4")
    status: str = Field(default="published", example="published")

class HackathonCreate(HackathonBase):
    pass

class HackathonUpdate(BaseModel):
    title: Optional[str] = None
    organizer: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    location: Optional[str] = None
    external_link: Optional[str] = None
    tags: Optional[List[str]] = None
    prize_pool: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    mode: Optional[str] = None
    team_size: Optional[str] = None
    status: Optional[str] = None

class HackathonResponse(HackathonBase):
    id: UUID
    submitted_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
