from datetime import date
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.daily_target import DailyTarget
from app.models.user_profile import UserProfile
from app.services.nutrition_service import NutritionService


class DailyTargetService:

    @staticmethod
    def generate_today(db: Session, user_id: int):

        today = date.today()

        existing = db.query(DailyTarget).filter(
            DailyTarget.user_id == user_id,
            DailyTarget.date == today
        ).first()

        if existing:
            return existing

        profile = db.query(UserProfile).filter(
            UserProfile.user_id == user_id
        ).first()

        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        targets = NutritionService.calculate(profile)

        new_target = DailyTarget(
            user_id=user_id,
            date=today,
            calorie_target=targets["total_calories"],
            protein_target=targets["protein_grams"],
            fat_target=targets["fat_grams"],
            carb_target=targets["carb_grams"],
            water_target=targets["water_ml"]
        )

        db.add(new_target)
        db.commit()
        db.refresh(new_target)

        return new_target

    @staticmethod
    def get_by_date(db: Session, user_id: int, target_date: date):

        target = db.query(DailyTarget).filter(
            DailyTarget.user_id == user_id,
            DailyTarget.date == target_date
        ).first()

        if not target:
            raise HTTPException(status_code=404, detail="Target not found")

        return target
