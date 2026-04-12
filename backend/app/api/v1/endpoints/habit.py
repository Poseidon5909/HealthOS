from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.habit_service import HabitService
from app.schemas.habit import (
    HabitStatusResponse,
    HabitStreaksResponse,
    HabitLogCreate,
    HabitLogResponse
)
from app.schemas.pagination import PaginatedResponse

router = APIRouter(tags=["Habits"])


@router.get("/today-status", response_model=HabitStatusResponse)
def today_status(
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)):

    return HabitService.get_today_status(
        db=db,
        user_id=current_user.id
    )


@router.get("/streaks", response_model=HabitStreaksResponse)
def habit_streaks(
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)):

    return HabitService.get_streaks(
        db=db,
        user_id=current_user.id
    )


@router.post("", response_model=HabitLogResponse, status_code=201)
def log_habit(
        habit_data: HabitLogCreate,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)):
    """
    Log a custom habit (e.g., meditation, sleep, reading).
    
    - **habit_type**: Type of habit (e.g., 'meditation', 'sleep', 'reading')
    - **success**: Whether the habit was completed successfully
    """
    return HabitService.create_habit_log(
        db=db,
        user_id=current_user.id,
        habit_type=habit_data.habit_type,
        success=habit_data.success
    )


@router.get("/history", response_model=PaginatedResponse[HabitLogResponse])
def habit_history(
        skip: int = Query(0, ge=0, description="Number of items to skip"),
        limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)):
    """
    Get paginated habit log history for the current user.
    
    - **skip**: Pagination offset
    - **limit**: Max items per page (1-100)
    """
    return HabitService.get_habit_history(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )


@router.get("/{log_id}", response_model=HabitLogResponse)
def get_habit_log(
        log_id: int,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)):
    """Get a specific habit log by ID."""
    return HabitService.get_habit_by_id(
        db=db,
        user_id=current_user.id,
        log_id=log_id
    )


@router.delete("/{log_id}")
def delete_habit_log(
        log_id: int,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)):
    """Delete a habit log."""
    return HabitService.delete_habit_log(
        db=db,
        user_id=current_user.id,
        log_id=log_id
    )