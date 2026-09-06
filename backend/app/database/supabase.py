from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    global supabase_client
    if supabase_client is None:
        if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY and settings.SUPABASE_ANON_KEY != "mock-anon-key":
            try:
                supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            except Exception as e:
                print(f"Supabase client init error: {e}")
    return supabase_client
