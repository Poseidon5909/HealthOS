from pydantic_settings import BaseSettings
from pydantic import field_validator
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
  APP_NAME: str
  DATABASE_URL: str
  DEBUG: bool = False
  SECRET_KEY: str
  ALGORITHM: str
  ACCESS_TOKEN_EXPIRE_MINUTES: int
  REFRESH_TOKEN_EXPIRE_DAYS: int = 7
  
  # CORS settings
  CORS_ORIGINS: list = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5173",
    "http://localhost:8000",
  ]

  
  # Rate limiting
  RATE_LIMIT_PER_MINUTE: int = 60
  
  # Email settings
  SMTP_HOST: str = "smtp.gmail.com"
  SMTP_PORT: int = 587
  SMTP_USERNAME: str = ""
  SMTP_PASSWORD: str = ""
  SMTP_FROM_EMAIL: str = ""
  SMTP_FROM_NAME: str = "HealthOS"
  FRONTEND_URL: str = "http://localhost:5173"

  # Google OAuth settings
  GOOGLE_CLIENT_ID: str = ""
  GOOGLE_CLIENT_SECRET: str = ""
  GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"

  @field_validator("DATABASE_URL", mode="before")
  @classmethod
  def normalize_sqlite_url(cls, value: str):
    if isinstance(value, str) and value.startswith("sqlite:///./"):
      relative_db_path = value.removeprefix("sqlite:///./")
      absolute_db_path = (BACKEND_DIR / relative_db_path).resolve()
      return f"sqlite:///{absolute_db_path.as_posix()}"
    return value

  class Config:
    env_file = str(BACKEND_DIR / ".env")


settings = Settings()
