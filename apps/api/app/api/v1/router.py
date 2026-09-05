from fastapi import APIRouter
from app.api.v1.endpoints import health, opportunities

api_router = APIRouter()
api_router.include_router(health.router, prefix="", tags=["Health"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Opportunities"])
