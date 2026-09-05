import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ARRAY, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from app.db.session import Base

request_status_enum = ENUM(
    'pending', 'accepted', 'rejected', 'withdrawn',
    name='request_status',
    create_type=False
)

class TeamRequest(Base):
    __tablename__ = "team_requests"
    __table_args__ = {"schema": "public"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    opportunity_id = Column(UUID(as_uuid=True), ForeignKey("public.opportunities.id", ondelete="CASCADE"), nullable=False)
    requester_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String, nullable=False)
    role_needed = Column(String, nullable=False)
    skills_required = Column(ARRAY(String), default=list, nullable=False)
    max_members = Column(Integer, default=4, nullable=False)
    current_members_count = Column(Integer, default=1, nullable=False)
    status = Column(request_status_enum, default="pending", nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
