from typing import Optional, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.session import get_db
from app.core.security import get_current_user, get_optional_user
from app.models.profile import Profile
from app.schemas.member import MemberResponse

router = APIRouter()

@router.get("/me", response_model=Optional[MemberResponse], summary="Current user profile and role")
async def get_current_profile(
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user and current_user.get("id"):
        uid = UUID(current_user["id"])
        res = await db.execute(select(Profile).where(Profile.id == uid))
        profile = res.scalar_one_or_none()
        if profile:
            return profile

    # Fallback to first profile in directory (dev)
    res = await db.execute(select(Profile).order_by(Profile.created_at.asc()).limit(1))
    return res.scalar_one_or_none()

@router.get("/role-check", summary="Check if current user is admin")
async def check_user_role(
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    is_admin = False
    role = "student"
    if current_user and current_user.get("id"):
        uid = UUID(current_user["id"])
        res = await db.execute(select(Profile).where(Profile.id == uid))
        p = res.scalar_one_or_none()
        if p:
            role = p.role
            is_admin = (p.role == "admin")
    else:
        # Check if an admin exists
        res = await db.execute(select(Profile).where(Profile.role == "admin").limit(1))
        if res.scalar_one_or_none():
            is_admin = True
            role = "admin"

    return {"is_admin": is_admin, "role": role}
