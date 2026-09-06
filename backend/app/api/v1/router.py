from fastapi import APIRouter
from app.api.v1 import auth, members, placements, hackathons, projects, whatsapp
from app.api.v1.endpoints import opportunities, health, team_requests

api_router = APIRouter()

# Main REST API Routers
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(members.router, prefix="/members", tags=["Members"])
api_router.include_router(placements.router, prefix="/placements", tags=["Placements"])
api_router.include_router(hackathons.router, prefix="/hackathons", tags=["Hackathons"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(whatsapp.router, prefix="/whatsapp", tags=["WhatsApp"])

# Legacy / Backward Compatible Routes
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Opportunities"])
api_router.include_router(members.router, prefix="/users", tags=["Users"])
api_router.include_router(team_requests.router, prefix="/team-requests", tags=["Team Requests"])
