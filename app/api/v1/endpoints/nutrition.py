from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user_profile import UserProfile
from app.services.nutrition_service import NutritionService

router = APIRouter()

@router.get("/calculate-daily-targets")
def calculate_daily_targets(
  db: Session = Depends(get_db),
  current_user = Depends(get_current_user)
):
  profile = db.query(UserProfile).filter(
    UserProfile.user_id == current_user.id
  ).first()

  return NutritionService.calculate(profile)