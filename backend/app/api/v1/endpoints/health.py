from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db
from app.core.config import settings

router = APIRouter()

@router.get("", tags=["Health"])
async def health_check(db: AsyncSession = Depends(get_db)):
    """System liveness and database connectivity probe."""
    db_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
        
    return {
        "status": "online",
        "environment": settings.ENVIRONMENT,
        "database": db_status
    }
