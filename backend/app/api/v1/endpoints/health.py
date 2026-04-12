from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine

router = APIRouter()


@router.get("/")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "healthy"}
    except Exception:
        return {"status": "database connection failed"}
