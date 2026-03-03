from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.services.hydration_service import HydrationService
from app.core.security import get_current_user

router = APIRouter(prefix="/hydration", tags=["Hydration"])

@router.post("/")
def log_water(
    amount_ml: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return HydrationService.log_water(
        db=db,
        user_id=current_user.id,
        amount_ml=amount_ml
    )

@router.get("/daily")
def get_daily_summary(
    log_date: date,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return HydrationService.get_daily_summary(
        db=db,
        user_id=current_user.id,
        log_date=log_date
    )