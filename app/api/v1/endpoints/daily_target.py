from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.daily_target import DailyTargetResponse
from app.services.daily_target_service import DailyTargetService

router = APIRouter()


@router.post("/today", response_model=DailyTargetResponse)
def generate_today_target(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return DailyTargetService.generate_today(db, current_user.id)


@router.get("/today", response_model=DailyTargetResponse)
def get_today_target(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
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
    return DailyTargetService.get_by_date(
        db,
        current_user.id,
        target_date
    )
