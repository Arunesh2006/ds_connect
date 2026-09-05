from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl

class OpportunityBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=150, example="Kaggle AI Olympiad 2026")
    description: str = Field(..., min_length=10, example="Global machine learning competition on foundation models.")
    type: str = Field(..., example="hackathon")
    organizer: str = Field(..., example="Kaggle & Google AI")
    deadline: datetime = Field(..., example="2026-10-31T23:59:59Z")
    location: str = Field(default="Online", example="Online")
    external_link: Optional[str] = Field(None, example="https://kaggle.com/competitions")
    tags: List[str] = Field(default_factory=list, example=["Kaggle", "Machine Learning", "NLP"])

class OpportunityCreate(OpportunityBase):
    status: Optional[str] = Field(default="published", example="published")

class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    organizer: Optional[str] = None
    deadline: Optional[datetime] = None
    location: Optional[str] = None
    external_link: Optional[str] = None
    tags: Optional[List[str]] = None

class OpportunityResponse(OpportunityBase):
    id: UUID
    status: str
    submitted_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
