import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

def get_default_db_url() -> str:
    root_db = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../karyadrishti.db'))
    backend_db = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../karyadrishti.db'))
    cwd_db = os.path.abspath('karyadrishti.db')
    
    for candidate in [backend_db, root_db, cwd_db]:
        if os.path.exists(candidate) and os.path.getsize(candidate) > 100000:
            clean_path = candidate.replace('\\', '/')
            return f"sqlite:///{clean_path}"
    
    # Default fallback
    clean_fallback = backend_db.replace('\\', '/')
    return f"sqlite:///{clean_fallback}"

default_db_url = get_default_db_url()

class Settings(BaseSettings):
    PROJECT_NAME: str = "KARYADRISHTI"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database - Default to env DATABASE_URL or SQLite fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", default_db_url)
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "karyadrishti_dev_secret_key_super_secure_32bytes_min")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ]
    
    # External APIs & Models
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    MODEL_ARTIFACT_PATH: str = os.getenv("MODEL_ARTIFACT_PATH", "./ml/artifacts/models")
    PAIMANA_DATA_PATH: str = os.getenv("PAIMANA_DATA_PATH", "./data/raw/paimana")
    
    # Feature Flags
    ENABLE_ASSISTANT: bool = os.getenv("ENABLE_ASSISTANT", "false").lower() == "true"
    ENABLE_EXTERNAL_NOTIFICATIONS: bool = os.getenv("ENABLE_EXTERNAL_NOTIFICATIONS", "false").lower() == "true"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
