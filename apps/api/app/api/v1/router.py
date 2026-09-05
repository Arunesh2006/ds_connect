from fastapi import APIRouter
from app.api.v1.endpoints import health, opportunities, team_requests

api_router = APIRouter()
api_router.include_router(health.router, prefix="", tags=["Health"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Opportunities"])
api_router.include_router(team_requests.router, prefix="/team-requests", tags=["Team Requests"])
