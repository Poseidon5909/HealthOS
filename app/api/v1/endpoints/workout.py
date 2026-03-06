from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from app.core.database import get_db
from app.services.workout_service import WorkoutService
from app.core.security import get_current_user
from app.schemas.workout import WorkoutLogCreate, WorkoutLogUpdate, WorkoutLogResponse
from app.schemas.exercise import ExerciseResponse
from app.schemas.pagination import PaginatedResponse

router = APIRouter()

@router.get("/exercises/search", response_model=PaginatedResponse[ExerciseResponse])
def search_exercises(
    query: Optional[str] = Query(None, description="Search exercises by name"),
    category: Optional[str] = Query(None, description="Filter by category (cardio, strength, flexibility, sports, core, daily)"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    db: Session = Depends(get_db)
):
    """
    Search exercises with optional filters.
    
    - **query**: Search term to filter exercises by name (case-insensitive)
    - **category**: Filter by category (cardio, strength, flexibility, sports, core, daily)
    - **skip**: Pagination offset
    - **limit**: Max items per page (1-100)
    """
    return WorkoutService.search_exercises(db, query, category, skip, limit)

@router.post("/", response_model=WorkoutLogResponse)
def log_workout(workout_data: WorkoutLogCreate,
                db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):
  """
  Log a workout session for the current user.
  
  - **exercise_id**: ID of the exercise from the exercises table
  - **duration_minutes**: Duration of the workout in minutes
  
  Calories burned are automatically calculated using MET values.
  """
  return WorkoutService.log_workout(
    db=db,
    user_id=current_user.id,
    exercise_id=workout_data.exercise_id,
    duration_minutes=workout_data.duration_minutes
  )

@router.get("/history", response_model=PaginatedResponse[WorkoutLogResponse])
def get_workout_history(
    start_date: Optional[date] = Query(None, description="Filter from this date"),
    end_date: Optional[date] = Query(None, description="Filter until this date"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get workout log history with optional date filtering and pagination.
    
    - **start_date**: Filter logs from this date onwards
    - **end_date**: Filter logs until this date
    - **skip**: Pagination offset
    - **limit**: Max items per page (1-100)
    """
    return WorkoutService.get_logs_history(
        db, current_user.id, start_date, end_date, skip, limit
    )

@router.get("/daily/total")
def get_daily_total(
  log_date: date,
  db: Session = Depends(get_db),
  current_user = Depends(get_current_user)
):
  """
  Get total calories burned on a specific date.
  
  - **log_date**: Date to calculate total for
  """
  return {
    "total_calories_burned":
    WorkoutService.get_daily_total_burn(db, current_user.id, log_date)
  }

@router.get("/{log_id}", response_model=WorkoutLogResponse)
def get_workout_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific workout log by ID."""
    return WorkoutService.get_by_id(db, current_user.id, log_id)

@router.put("/{log_id}", response_model=WorkoutLogResponse)
def update_workout_log(
    log_id: int,
    data: WorkoutLogUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a workout log (exercise or duration)."""
    return WorkoutService.update_log(
        db,
        current_user.id,
        log_id,
        data.exercise_id,
        data.duration_minutes
    )

@router.delete("/{log_id}")
def delete_workout_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a workout log."""
    return WorkoutService.delete_log(db, current_user.id, log_id)
