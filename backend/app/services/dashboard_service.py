from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.models.daily_target import DailyTarget
from app.models.food_log import FoodLog
from app.models.workout_log import WorkoutLog
from app.models.water_log import WaterLog
from app.models.weight_log import WeightLog

from app.services.progress_service import ProgressService


class DashboardService:

    @staticmethod
    def get_dashboard(db: Session, user_id: int):

        today = date.today()

        target = db.query(DailyTarget).filter(
            DailyTarget.user_id == user_id
        ).first()

        calorie_target = target.calorie_target if target else 0
        protein_target = target.protein_target if target else 0
        carbs_target = target.carb_target if target else 0
        fat_target = target.fat_target if target else 0
        water_target = target.water_target if target else 0

        food_summary = db.query(
            func.coalesce(func.sum(FoodLog.calculated_calories), 0),
            func.coalesce(func.sum(FoodLog.calculated_protein), 0),
            func.coalesce(func.sum(FoodLog.calculated_carbs), 0),
            func.coalesce(func.sum(FoodLog.calculated_fat), 0)
        ).filter(
            FoodLog.user_id == user_id,
            FoodLog.date == today
        ).first()

        calories_consumed = food_summary[0]
        protein_consumed = food_summary[1]
        carbs_consumed = food_summary[2]
        fat_consumed = food_summary[3]

        calories_remaining = max(calorie_target - calories_consumed, 0)

        water_consumed = db.query(
            func.coalesce(func.sum(WaterLog.amount_ml), 0)
        ).filter(
            WaterLog.user_id == user_id,
            WaterLog.date == today
        ).scalar()

        hydration_progress = 0
        if water_target > 0:
            hydration_progress = min((water_consumed / water_target) * 100, 100)

        workout_summary = db.query(
            func.coalesce(func.sum(WorkoutLog.calories_burned), 0),
            func.coalesce(func.sum(WorkoutLog.duration_minutes), 0)
        ).filter(
            WorkoutLog.user_id == user_id,
            WorkoutLog.date == today
        ).first()

        calories_burned = workout_summary[0]
        workout_duration = workout_summary[1]

        latest_weight_entry = db.query(WeightLog).filter(
            WeightLog.user_id == user_id
        ).order_by(WeightLog.date.desc()).first()

        latest_weight = latest_weight_entry.weight if latest_weight_entry else 0

        weekly_weight = ProgressService.get_weekly_weight_change(db, user_id)

        consistency = ProgressService.get_consistency_summary(db, user_id)

        return {

            "calories": {
                "target": calorie_target,
                "consumed": calories_consumed,
                "remaining": calories_remaining
            },

            "macros": {
                "protein": {"consumed": protein_consumed, "target": protein_target},
                "carbs": {"consumed": carbs_consumed, "target": carbs_target},
                "fat": {"consumed": fat_consumed, "target": fat_target}
            },

            "hydration": {
                "consumed_ml": water_consumed,
                "target_ml": water_target,
                "progress_percentage": round(hydration_progress, 2)
            },

            "workout": {
                "calories_burned": calories_burned,
                "duration_minutes": workout_duration
            },

            "weight": {
                "latest_weight": latest_weight,
                "weekly_change": weekly_weight["weekly_change"]
            },

            "consistency": consistency
        }