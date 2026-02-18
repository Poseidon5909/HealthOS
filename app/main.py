from fastapi import FastAPI
from app.core.config import settings
from app.api.router import api_router


app = FastAPI(title=settings.APP_NAME)

app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "HealthOS Backend Running"}

from app.core.database import engine, Base
from app.models import user  # Import to register model


Base.metadata.create_all(bind=engine)