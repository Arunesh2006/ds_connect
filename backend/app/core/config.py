import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "DS-Connect API"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Supabase Credentials
    SUPABASE_URL: str = "http://localhost:54321"
    SUPABASE_ANON_KEY: str = "mock-anon-key"
    SUPABASE_JWT_SECRET: str = ""  # Used for local HMAC HS256 fallback if not using JWKS
    
    # Database Connection (Async SQLAlchemy)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:54322/postgres"
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # WhatsApp Meta Cloud API Configuration
    WHATSAPP_ACCESS_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = ""
    WHATSAPP_DESTINATION_ID: str = ""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
