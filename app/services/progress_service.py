from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.models.weight_log import WeightLog
from app.models.food_log import FoodLog
from app.models.workout_log import WorkoutLog
from app.models.water_log import WaterLog
from app.models.daily_target import DailyTarget


class ProgressService:

    # -------------------------
    # Weight Logging
    # -------------------------
    @staticmethod
    def log_weight(db: Session, user_id: int, weight: float):

        if weight <= 0:
            raise Exception("Weight must be positive")

        entry = WeightLog(
            user_id=user_id,
            weight=weight,
            date=date.today()
        )

        db.add(entry)
        db.commit()
        db.refresh(entry)

        return entry

    @staticmethod
    def get_weight_history(db: Session, user_id: int):
        return db.query(WeightLog)\
                 .filter(WeightLog.user_id == user_id)\
                 .order_by(WeightLog.date.asc())\
                 .all()

    # -------------------------
    # Weekly Weight Change
    # -------------------------
    @staticmethod
    def get_weekly_weight_change(db: Session, user_id: int):

        today = date.today()
        current_week_start = today - timedelta(days=7)
        previous_week_start = today - timedelta(days=14)

        current_avg = db.query(func.avg(WeightLog.weight))\
            .filter(
                WeightLog.user_id == user_id,
                WeightLog.date >= current_week_start
            ).scalar()

        previous_avg = db.query(func.avg(WeightLog.weight))\
            .filter(
                WeightLog.user_id == user_id,
                WeightLog.date >= previous_week_start,
                WeightLog.date < current_week_start
            ).scalar()

        current_avg = current_avg or 0
        previous_avg = previous_avg or 0

        weekly_change = current_avg - previous_avg

        return {
            "current_week_avg": round(current_avg, 2),
            "previous_week_avg": round(previous_avg, 2),
            "weekly_change": round(weekly_change, 2)
        }

    # -------------------------
    # Consistency Metrics
    # -------------------------
    @staticmethod
    def get_consistency_summary(db: Session, user_id: int):

        today = date.today()
        week_start = today - timedelta(days=7)

        target = db.query(DailyTarget)\
                   .filter(DailyTarget.user_id == user_id)\
                   .first()

        if not target:
            return {}

        calorie_target = target.calorie_target
        water_target = target.water_target

        # --- Macro consistency ---
        food_days = db.query(FoodLog.date)\
            .filter(
                FoodLog.user_id == user_id,
                FoodLog.date >= week_start
            )\
            .group_by(FoodLog.date)\
            .all()

        macro_consistent_days = 0

        for day_tuple in food_days:
            day = day_tuple[0]

            total_calories = db.query(func.sum(FoodLog.calories))\
                .filter(
                    FoodLog.user_id == user_id,
                    FoodLog.date == day
                ).scalar() or 0

            lower = calorie_target * 0.9
            upper = calorie_target * 1.1

            if lower <= total_calories <= upper:
                macro_consistent_days += 1

        macro_consistency = (macro_consistent_days / 7) * 100

        # --- Workout consistency ---
        workout_days = db.query(WorkoutLog.date)\
            .filter(
                WorkoutLog.user_id == user_id,
                WorkoutLog.date >= week_start
            )\
            .group_by(WorkoutLog.date)\
            .count()

        workout_consistency = (workout_days / 7) * 100

        # --- Hydration consistency ---
        water_days = db.query(WaterLog.date)\
            .filter(
                WaterLog.user_id == user_id,
                WaterLog.date >= week_start
            )\
            .group_by(WaterLog.date)\
            .all()

        hydration_consistent_days = 0

        for day_tuple in water_days:
            day = day_tuple[0]

            total_water = db.query(func.sum(WaterLog.amount_ml))\
                .filter(
                    WaterLog.user_id == user_id,
                    WaterLog.date == day
                ).scalar() or 0

            if total_water >= water_target:
                hydration_consistent_days += 1

        hydration_consistency = (hydration_consistent_days / 7) * 100

        return {
            "macro_consistency_percentage": round(macro_consistency, 2),
            "workout_consistency_percentage": round(workout_consistency, 2),
            "hydration_consistency_percentage": round(hydration_consistency, 2)
        }