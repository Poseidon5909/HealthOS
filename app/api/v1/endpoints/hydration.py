from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from app.core.database import get_db
from app.services.hydration_service import HydrationService
from app.core.security import get_current_user
from app.schemas.water_log import WaterLogCreate, WaterLogResponse, HydrationSummary
from app.schemas.pagination import PaginatedResponse

router = APIRouter()

@router.post("/", response_model=WaterLogResponse)
def log_water(
    water_data: WaterLogCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Log water intake for the current user.
    
    - **amount_ml**: Amount of water in milliliters (must be positive)
    """
    return HydrationService.log_water(
        db=db,
        user_id=current_user.id,
        amount_ml=water_data.amount_ml
    )

@router.get("/history", response_model=PaginatedResponse[WaterLogResponse])
def get_water_history(
    start_date: Optional[date] = Query(None, description="Filter from this date"),
    end_date: Optional[date] = Query(None, description="Filter until this date"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get water log history with optional date filtering and pagination.
    
    - **start_date**: Filter logs from this date onwards
    - **end_date**: Filter logs until this date
    - **skip**: Pagination offset
    - **limit**: Max items per page (1-100)
    """
    return HydrationService.get_logs_history(
        db, current_user.id, start_date, end_date, skip, limit
    )

@router.get("/daily", response_model=HydrationSummary)
def get_daily_summary(
    log_date: date = Query(default=None, description="Date to get summary for (defaults to today)"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get hydration summary for a specific date.
    
    - **log_date**: Date to get summary for (defaults to today if not provided)
    """
    # Default to today if not provided
    if log_date is None:
        log_date = date.today()
    
    return HydrationService.get_daily_summary(
        db=db,
        user_id=current_user.id,
        log_date=log_date
    )

@router.get("/{log_id}", response_model=WaterLogResponse)
def get_water_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific water log by ID."""
    return HydrationService.get_by_id(db, current_user.id, log_id)

@router.delete("/{log_id}")
def delete_water_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a water log."""
    return HydrationService.delete_log(db, current_user.id, log_id)