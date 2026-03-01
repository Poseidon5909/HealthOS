from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.food_log import FoodLog
from app.models.food_item import FoodItem
from app.models.daily_target import DailyTarget


class FoodLogService:

    @staticmethod
    def log_food(db: Session, user_id: int, food_id: int, quantity: float):

        food = db.query(FoodItem).filter(FoodItem.id == food_id).first()

        if not food:
            raise HTTPException(status_code=404, detail="Food not found")

        factor = quantity / 100

        calories = food.calories_per_100g * factor
        protein = food.protein_per_100g * factor
        fat = food.fat_per_100g * factor
        carbs = food.carbs_per_100g * factor

        log = FoodLog(
            user_id=user_id,
            food_id=food_id,
            quantity_grams=quantity,
            calculated_calories=round(calories, 2),
            calculated_protein=round(protein, 2),
            calculated_fat=round(fat, 2),
            calculated_carbs=round(carbs, 2),
            date=date.today()
        )

        db.add(log)
        db.commit()
        db.refresh(log)

        return log

    @staticmethod
    def get_daily_logs(db: Session, user_id: int, target_date: date):
        return db.query(FoodLog).filter(
            FoodLog.user_id == user_id,
            FoodLog.date == target_date
        ).all()

    @staticmethod
    def get_daily_summary(db: Session, user_id: int, target_date: date):

        totals = db.query(
            func.sum(FoodLog.calculated_calories),
            func.sum(FoodLog.calculated_protein),
            func.sum(FoodLog.calculated_fat),
            func.sum(FoodLog.calculated_carbs)
        ).filter(
            FoodLog.user_id == user_id,
            FoodLog.date == target_date
        ).first()

        daily_target = db.query(DailyTarget).filter(
            DailyTarget.user_id == user_id,
            DailyTarget.date == target_date
        ).first()

        if not daily_target:
            raise HTTPException(status_code=404, detail="Daily target not found")

        consumed = {
            "calories": totals[0] or 0,
            "protein": totals[1] or 0,
            "fat": totals[2] or 0,
            "carbs": totals[3] or 0
        }

        remaining = {
            "calories": daily_target.calorie_target - consumed["calories"],
            "protein": daily_target.protein_target - consumed["protein"],
            "fat": daily_target.fat_target - consumed["fat"],
            "carbs": daily_target.carb_target - consumed["carbs"]
        }

        return {
            "consumed": consumed,
            "remaining": remaining,
            "target": {
                "calories": daily_target.calorie_target,
                "protein": daily_target.protein_target,
                "fat": daily_target.fat_target,
                "carbs": daily_target.carb_target
            }
        }