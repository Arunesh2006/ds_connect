from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    description="DS-Connect Production Full-Stack Portal API - Placements, Hackathons, Projects, Members & WhatsApp Integration",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend and public deployment tunnels
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Root"])
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": "2.0.0",
        "documentation": "/docs",
        "api_prefix": settings.API_V1_PREFIX
    }

@app.get("/api/v1/health/db", tags=["Root"])
async def db_health():
    from sqlalchemy import text
    from app.database.session import AsyncSessionLocal
    from urllib.parse import urlparse
    
    parsed = urlparse(settings.DATABASE_URL)
    masked_host = f"{parsed.hostname}:{parsed.port}" if parsed.hostname else "unknown"
    is_localhost = "localhost" in masked_host or "127.0.0.1" in masked_host
    
    result = {
        "configured_host": masked_host,
        "is_localhost": is_localhost,
        "status": "pending"
    }
    
    if is_localhost:
        result["status"] = "error"
        result["message"] = f"DATABASE_URL is not set in Render Environment variables. It is still defaulting to {masked_host}. Please add DATABASE_URL in Render."
        return result
        
    try:
        async with AsyncSessionLocal() as db:
            await db.execute(text("SELECT 1"))
            table_check = await db.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'opportunities')"))
            has_table = table_check.scalar()
            if has_table:
                count_res = await db.execute(text("SELECT count(*) FROM public.opportunities"))
                count = count_res.scalar()
                result["status"] = "healthy"
                result["opportunities_count"] = count
                result["message"] = f"Connected to database successfully! {count} opportunities exist."
            else:
                result["status"] = "migration_needed"
                result["message"] = "Connected to database, but tables do not exist yet. Please run supabase/migrations/20260905000001_initial_schema.sql in Supabase SQL Editor."
    except Exception as e:
        result["status"] = "error"
        result["message"] = f"Failed to connect to database: {str(e)}"
        
    return result
