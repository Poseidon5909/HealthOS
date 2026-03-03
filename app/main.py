from fastapi import FastAPI
from app.core.config import settings
from app.api.router import api_router
from app.models import user_profile
from app.models import daily_target
from app.models import food_item
from app.models import food_log
from app.models import exercise
from app.models import workout_log
from app.models import water_log


app = FastAPI(title=settings.APP_NAME)

app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "HealthOS Backend Running"}

from app.core.database import engine, Base, get_db
from app.models import user  # Import to register model
from app.services.food_service import FoodService
from app.seeds.exercise_seed import seed_exercises


Base.metadata.create_all(bind=engine)

# Seed initial data
db = next(get_db())
FoodService.seed_initial_data(db)
seed_exercises(db)
db.close()