from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class TeamRequestBase(BaseModel):
    opportunity_id: UUID
    title: str = Field(..., min_length=5, max_length=150, example="Looking for NLP Specialist for Kaggle Olympiad")
    role_needed: str = Field(..., example="NLP / LLM Engineer")
    skills_required: List[str] = Field(default_factory=list, example=["PyTorch", "HuggingFace"])
    max_members: int = Field(default=4, ge=2, le=10)

class TeamRequestCreate(TeamRequestBase):
    pass

class TeamRequestResponse(TeamRequestBase):
    id: UUID
    requester_id: Optional[UUID] = None
    current_members_count: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
