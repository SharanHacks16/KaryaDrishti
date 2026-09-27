import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

default_db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../karyadrishti.db')).replace('\\', '/')

class Settings(BaseSettings):
    PROJECT_NAME: str = "KARYADRISHTI"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database - Default to env DATABASE_URL or SQLite fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{default_db_path}")
    
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
