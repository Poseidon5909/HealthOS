from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.progress_service import ProgressService
from app.schemas.weight_log import WeightLogCreate, WeightLogUpdate, WeightLogResponse
from app.schemas.pagination import PaginatedResponse

router = APIRouter()

@router.post("/weight", response_model=WeightLogResponse)
def log_weight(weight_data: WeightLogCreate,
               db: Session = Depends(get_db),
               current_user = Depends(get_current_user)):
  """
  Log weight entry for the current user.
  
  - **weight**: Weight in kilograms (must be positive, max 500kg)
  """
  return ProgressService.log_weight(db, current_user.id, weight_data.weight)

@router.get("/weight/history", response_model=List[WeightLogResponse])
def weight_history(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=500, description="Number of items to return"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
  """Get complete weight history for the current user (ascending by date)."""
  return ProgressService.get_weight_history(db, current_user.id, skip, limit)

@router.get("/weight/history/filtered", response_model=PaginatedResponse[WeightLogResponse])
def weight_history_filtered(
    start_date: Optional[date] = Query(None, description="Filter from this date"),
    end_date: Optional[date] = Query(None, description="Filter until this date"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get weight log history with optional date filtering and pagination.
    
    - **start_date**: Filter logs from this date onwards
    - **end_date**: Filter logs until this date
    - **skip**: Pagination offset
    - **limit**: Max items per page (1-100)
    """
    return ProgressService.get_weight_history_filtered(
        db, current_user.id, start_date, end_date, skip, limit
    )

@router.get("/weight/{log_id}", response_model=WeightLogResponse)
def get_weight_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific weight log by ID."""
    return ProgressService.get_weight_by_id(db, current_user.id, log_id)

@router.put("/weight/{log_id}", response_model=WeightLogResponse)
def update_weight_log(
    log_id: int,
    data: WeightLogUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a weight log entry."""
    return ProgressService.update_weight(
        db,
        current_user.id,
        log_id,
        data.weight,
        data.date
    )

@router.delete("/weight/{log_id}")
def delete_weight_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a weight log entry."""
    return ProgressService.delete_weight(db, current_user.id, log_id)

@router.get("/weekly-summary")
def weekly_summary(db: Session = Depends(get_db),
                   current_user = Depends(get_current_user)):
    """Get weekly weight change summary comparing current and previous week."""
    return ProgressService.get_weekly_weight_change(db, current_user.id)


@router.get("/consistency")
def consistency(db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):
    """Get consistency metrics for nutrition, workout, and hydration over the past week."""
    return ProgressService.get_consistency_summary(db, current_user.id)