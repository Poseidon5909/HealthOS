from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.daily_target import DailyTargetResponse, DailyTargetUpdate
from app.services.daily_target_service import DailyTargetService

router = APIRouter()


@router.post("/today", response_model=DailyTargetResponse)
def generate_today_target(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Generate daily targets for today based on user profile."""
    return DailyTargetService.generate_today(db, current_user.id)


@router.get("/today", response_model=DailyTargetResponse)
def get_today_target(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get today's daily targets."""
    return DailyTargetService.get_by_date(
        db,
        current_user.id,
        date.today()
    )


@router.get("/", response_model=DailyTargetResponse)
def get_target_by_date(
    target_date: date = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get daily targets for a specific date."""
    return DailyTargetService.get_by_date(
        db,
        current_user.id,
        target_date
    )

@router.put("/", response_model=DailyTargetResponse)
def update_target(
    data: DailyTargetUpdate,
    target_date: date = Query(default_factory=date.today, description="Date of target to update"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update daily targets for a specific date."""
    return DailyTargetService.update_target(
        db,
        current_user.id,
        target_date,
        data.calorie_target,
        data.protein_target,
        data.fat_target,
        data.carb_target,
        data.water_target
    )
