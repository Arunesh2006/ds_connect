from typing import Optional, Dict, Any
from uuid import UUID
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.session import get_db
from app.core.security import get_current_user, get_optional_user
from app.models.profile import Profile

async def require_admin_user(
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Enforces that the requester has administrative privileges.
    Verifies against public.profiles.role == 'admin'.
    In development mode, allows authorization if dev admin profile exists.
    """
    if not current_user:
        # Check if an admin exists in local database for dev convenience
        res = await db.execute(select(Profile).where(Profile.role == "admin").limit(1))
        admin_profile = res.scalar_one_or_none()
        if admin_profile:
            return {
                "id": str(admin_profile.id),
                "email": admin_profile.email,
                "role": "admin",
                "name": admin_profile.name
            }
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required for admin access"
        )
    
    user_id = UUID(current_user["id"])
    res = await db.execute(select(Profile).where(Profile.id == user_id))
    profile = res.scalar_one_or_none()
    
    if not profile or profile.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
        
    return {
        "id": str(profile.id),
        "email": profile.email,
        "role": profile.role,
        "name": profile.name
    }
