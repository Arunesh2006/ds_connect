from fastapi import APIRouter
from app.api.v1.endpoints import health, users, opportunities, team_requests, projects, placements

api_router = APIRouter()
api_router.include_router(health.router, prefix="", tags=["Health"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Cohort"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Curated Opportunities"])
api_router.include_router(team_requests.router, prefix="/team-requests", tags=["Team Matcher"])
api_router.include_router(projects.router, prefix="/projects", tags=["Student Projects"])
api_router.include_router(placements.router, prefix="/placements", tags=["Placements & Achievements"])
