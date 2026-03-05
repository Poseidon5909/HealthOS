from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.habit_service import HabitService

router = APIRouter(prefix="/habit", tags=["Habit"])


@router.get("/today-status")
def today_status(
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)):

    return HabitService.get_today_status(
        db=db,
        user_id=current_user.id
    )


@router.get("/streaks")
def habit_streaks(
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)):

    return HabitService.get_streaks(
        db=db,
        user_id=current_user.id
    )