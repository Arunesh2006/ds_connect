import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ARRAY, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {"schema": "public"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    technologies = Column(ARRAY(String), default=list, nullable=False)
    repo_url = Column(String, nullable=True)
    live_url = Column(String, nullable=True)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class ProjectMember(Base):
    __tablename__ = "project_members"
    __table_args__ = {"schema": "public"}

    project_id = Column(UUID(as_uuid=True), ForeignKey("public.projects.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    role = Column(String, default="Contributor", nullable=False)
    joined_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
