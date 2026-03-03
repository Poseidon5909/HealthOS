from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.services.workout_service import WorkoutService
from app.core.security import get_current_user

router = APIRouter(prefix="/workouts", tags=["Workouts"])

@router.post("/")
def log_workout(exercise_id: int, duration_minutes: int,
                db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):
  
  return WorkoutService.log_workout(
    db=db,
    user_id=current_user.id,
    exercise_id=exercise_id,
    duration_minutes=duration_minutes
  )

@router.get("/daily/total")
def get_daily_total(
  log_date: date,
  db: Session = Depends(get_db),
  current_user = Depends(get_current_user)
):
  
  return {
    "total_calories_burned":
    WorkoutService.get_daily_total_burn(db, current_user.id, log_date)
  }
