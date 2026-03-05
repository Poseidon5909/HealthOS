from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from app.models.daily_target import DailyTarget
from app.models.food_log import FoodLog
from app.models.workout_log import WorkoutLog
from app.models.water_log import WaterLog


class HabitService:

    # ---------------------------
    # Hydration Habit
    # ---------------------------

    @staticmethod
    def hydration_complete(db: Session, user_id: int, check_date: date):

        water_target = db.query(DailyTarget.water_target).filter(
            DailyTarget.user_id == user_id
        ).scalar() or 0

        consumed = db.query(
            func.coalesce(func.sum(WaterLog.amount_ml), 0)
        ).filter(
            WaterLog.user_id == user_id,
            WaterLog.date == check_date
        ).scalar()

        return consumed >= water_target

    # ---------------------------
    # Nutrition Habit
    # ---------------------------

    @staticmethod
    def nutrition_within_target(db: Session, user_id: int, check_date: date):

        target = db.query(DailyTarget.calorie_target).filter(
            DailyTarget.user_id == user_id
        ).scalar() or 0

        calories = db.query(
            func.coalesce(func.sum(FoodLog.calculated_calories), 0)
        ).filter(
            FoodLog.user_id == user_id,
            FoodLog.date == check_date
        ).scalar()

        lower = target * 0.9
        upper = target * 1.1

        return lower <= calories <= upper

    # ---------------------------
    # Workout Habit
    # ---------------------------

    @staticmethod
    def workout_completed(db: Session, user_id: int, check_date: date):

        workout_count = db.query(WorkoutLog).filter(
            WorkoutLog.user_id == user_id,
            WorkoutLog.date == check_date
        ).count()

        return workout_count > 0

    # ---------------------------
    # Today's Habit Status
    # ---------------------------

    @staticmethod
    def get_today_status(db: Session, user_id: int):

        today = date.today()

        hydration = HabitService.hydration_complete(db, user_id, today)
        nutrition = HabitService.nutrition_within_target(db, user_id, today)
        workout = HabitService.workout_completed(db, user_id, today)

        return {
            "hydration_complete": hydration,
            "nutrition_within_target": nutrition,
            "workout_completed": workout
        }

    # ---------------------------
    # Streak Calculation
    # ---------------------------

    @staticmethod
    def calculate_streak(check_function, db: Session, user_id: int):

        streak = 0
        day = date.today()

        while True:

            success = check_function(db, user_id, day)

            if not success:
                break

            streak += 1
            day -= timedelta(days=1)

        return streak

    # ---------------------------
    # Habit Streaks
    # ---------------------------

    @staticmethod
    def get_streaks(db: Session, user_id: int):

        hydration_streak = HabitService.calculate_streak(
            HabitService.hydration_complete, db, user_id
        )

        nutrition_streak = HabitService.calculate_streak(
            HabitService.nutrition_within_target, db, user_id
        )

        workout_streak = HabitService.calculate_streak(
            HabitService.workout_completed, db, user_id
        )

        return {
            "hydration_streak": hydration_streak,
            "nutrition_streak": nutrition_streak,
            "workout_streak": workout_streak
        }