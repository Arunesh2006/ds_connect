from typing import Optional, Any
from app.core.config import settings

supabase_client: Optional[Any] = None

def get_supabase_client() -> Optional[Any]:
    global supabase_client
    if supabase_client is None:
        if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY and settings.SUPABASE_ANON_KEY != "mock-anon-key":
            try:
                from supabase import create_client
                supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            except ImportError:
                # supabase package not installed, fallback to direct asyncpg/SQLAlchemy
                pass
            except Exception as e:
                print(f"Supabase client init error: {e}")
    return supabase_client
