import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID, ENUM
from app.db.session import Base

user_role_enum = ENUM(
    'student', 'alumni', 'mentor', 'admin',
    name='user_role',
    create_type=False
)

class Profile(Base):
    __tablename__ = "profiles"
    __table_args__ = {"schema": "public"}

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    college_year = Column(Integer, nullable=True)
    role = Column(user_role_enum, default="student", nullable=False)
    bio = Column(Text, nullable=True)
    skills = Column(ARRAY(String), default=list, nullable=False)
    github_handle = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
