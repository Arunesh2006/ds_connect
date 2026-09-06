import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, Numeric, Boolean, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class Placement(Base):
    __tablename__ = "placements"
    __table_args__ = {"schema": "public"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    package_lpa = Column(Numeric(5, 2), nullable=True)
    placement_year = Column(Integer, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    consent_for_public_display = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

class Achievement(Base):
    __tablename__ = "achievements"
    __table_args__ = {"schema": "public"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=True)
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    achievement_date = Column(Date, nullable=False)
    certificate_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
