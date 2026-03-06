from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  APP_NAME: str
  DATABASE_URL: str
  DEBUG: bool = False
  SECRET_KEY: str
  ALGORITHM: str
  ACCESS_TOKEN_EXPIRE_MINUTES: int
  REFRESH_TOKEN_EXPIRE_DAYS: int = 7
  
  # CORS settings
  CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]
  
  # Rate limiting
  RATE_LIMIT_PER_MINUTE: int = 60

  class Config:
    env_file = ".env"


settings = Settings()
