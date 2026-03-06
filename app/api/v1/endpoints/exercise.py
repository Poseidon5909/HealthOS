from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.schemas.exercise import ExerciseResponse
from app.schemas.pagination import PaginatedResponse
from app.services.workout_service import WorkoutService

router = APIRouter(prefix="/exercises", tags=["Exercises"])


@router.get("/", response_model=PaginatedResponse[ExerciseResponse])
def list_exercises(
    search: Optional[str] = Query(None, description="Search by exercise name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    db: Session = Depends(get_db)
):
    """
    List all exercises with optional search and pagination.
    
    - **search**: Filter exercises by name (case-insensitive)
    - **category**: Filter by exercise category
    - **skip**: Pagination offset
    - **limit**: Max items per page (1-100)
    """
    return WorkoutService.search_exercises(db, search, category, skip, limit)
