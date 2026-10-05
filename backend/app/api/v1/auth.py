from typing import Optional, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
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
    x_user_role: Optional[str] = Header(None, alias="X-User-Role"),
    db: AsyncSession = Depends(get_db)
):
    if current_user and current_user.get("id"):
        uid = UUID(current_user["id"])
        res = await db.execute(select(Profile).where(Profile.id == uid))
        p = res.scalar_one_or_none()
        if p:
            return {"is_admin": (p.role == "admin"), "role": p.role}
        jwt_role = current_user.get("role", "student")
        return {"is_admin": (jwt_role == "admin"), "role": jwt_role}

    # Development simulation support via header
    if settings.ENVIRONMENT == "development" and x_user_role:
        return {"is_admin": (x_user_role == "admin"), "role": x_user_role}

    return {"is_admin": False, "role": "student"}
