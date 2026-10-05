from typing import Optional, Dict, Any
from uuid import UUID
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.database.session import get_db
from app.core.security import get_current_user, get_optional_user
from app.models.profile import Profile

async def require_admin_user(
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
    x_user_role: Optional[str] = Header(None, alias="X-User-Role"),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Enforces that the requester has administrative privileges.
    Verifies against verified JWT claims and public.profiles.role == 'admin'.
    In development mode ONLY, allows simulated testing via X-User-Role header.
    """
    # 1. Dev-mode explicit role simulation (only in development)
    if settings.ENVIRONMENT == "development" and x_user_role == "admin":
        res = await db.execute(select(Profile).where(Profile.role == "admin").limit(1))
        admin_profile = res.scalar_one_or_none()
        if admin_profile:
            return {
                "id": str(admin_profile.id),
                "email": admin_profile.email,
                "role": "admin",
                "name": admin_profile.name
            }
        return {
            "id": "00000000-0000-0000-0000-000000000001",
            "email": "admin@dsconnect.edu",
            "role": "admin",
            "name": "Dev Admin"
        }

    # 2. Strict requirement for authenticated user
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required for admin access"
        )
    
    user_id = UUID(current_user["id"])
    res = await db.execute(select(Profile).where(Profile.id == user_id))
    profile = res.scalar_one_or_none()
    
    if not profile or profile.role != "admin":
        # Check metadata or role claim in JWT
        jwt_role = current_user.get("role") or current_user.get("metadata", {}).get("role")
        if jwt_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required"
            )
        
    return {
        "id": str(profile.id) if profile else current_user["id"],
        "email": profile.email if profile else current_user.get("email", ""),
        "role": "admin",
        "name": profile.name if profile else "Admin"
    }
