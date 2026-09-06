import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID, ENUM
from app.db.session import Base

opportunity_type_enum = ENUM(
    'hackathon', 'event', 'internship', 'research', 'workshop',
    name='opportunity_type',
    create_type=False
)

opportunity_status_enum = ENUM(
    'draft', 'published', 'closed', 'archived',
    name='opportunity_status',
    create_type=False
)

class Opportunity(Base):
    __tablename__ = "opportunities"
    __table_args__ = {"schema": "public"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    type = Column(opportunity_type_enum, nullable=False)
    status = Column(opportunity_status_enum, default="published", nullable=False)
    organizer = Column(String, nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=False)
    location = Column(String, default="Online", nullable=False)
    external_link = Column(String, nullable=True)
    tags = Column(ARRAY(String), default=list, nullable=False)
    submitted_by = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

