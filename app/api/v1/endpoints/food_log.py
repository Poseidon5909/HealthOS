from fastapi import APIRouter, Depends  
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.food_log import FoodLogCreate, FoodLogResponse
from app.services.food_log_service import FoodLogService

router = APIRouter()

@router.post("/", response_model=FoodLogResponse)
def log_food(
  data: FoodLogCreate,
  db: Session = Depends(get_db),
  current_user = Depends(get_current_user)
):
    return FoodLogService.log_food(
        db,
        current_user.id,
        data.food_id,
        data.quantity_grams
    )

@router.get("/today")
def get_today_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return FoodLogService.get_daily_summary(
        db,
        current_user.id,
        date.today()
    )
