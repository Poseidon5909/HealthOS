from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from fastapi import HTTPException, status

from app.models.daily_target import DailyTarget
from app.models.food_log import FoodLog
from app.models.workout_log import WorkoutLog
from app.models.water_log import WaterLog
from app.models.habit_log import HabitLog


class HabitService:
    MAX_STREAK_LOOKBACK_DAYS = 365

    @staticmethod
    def hydration_complete(db: Session, user_id: int, check_date: date):

        water_target = db.query(DailyTarget.water_target).filter(
            DailyTarget.user_id == user_id
        ).scalar() or 0

        # If no valid target is set, hydration cannot be considered complete.
        if water_target <= 0:
            return False

        consumed = db.query(
            func.coalesce(func.sum(WaterLog.amount_ml), 0)
        ).filter(
            WaterLog.user_id == user_id,
            WaterLog.date == check_date
        ).scalar()

        return consumed >= water_target

    @staticmethod
    def nutrition_within_target(db: Session, user_id: int, check_date: date):

        target = db.query(DailyTarget.calorie_target).filter(
            DailyTarget.user_id == user_id
        ).scalar() or 0

        # If no valid target is set, nutrition cannot be considered complete.
        if target <= 0:
            return False

        calories = db.query(
            func.coalesce(func.sum(FoodLog.calculated_calories), 0)
        ).filter(
            FoodLog.user_id == user_id,
            FoodLog.date == check_date
        ).scalar()

        lower = target * 0.9
        upper = target * 1.1

        return lower <= calories <= upper

    @staticmethod
    def workout_completed(db: Session, user_id: int, check_date: date):

        workout_count = db.query(WorkoutLog).filter(
            WorkoutLog.user_id == user_id,
            WorkoutLog.date == check_date
        ).count()

        return workout_count > 0

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

    @staticmethod
    def calculate_streak(check_function, db: Session, user_id: int):

        streak = 0
        day = date.today()

        for _ in range(HabitService.MAX_STREAK_LOOKBACK_DAYS):

            success = check_function(db, user_id, day)

            if not success:
                break

            streak += 1
            day -= timedelta(days=1)

        return streak

    @staticmethod
    def _streak_from_success_dates(success_dates: set[date]) -> int:
        streak = 0
        day = date.today()

        while streak < HabitService.MAX_STREAK_LOOKBACK_DAYS and day in success_dates:
            streak += 1
            day -= timedelta(days=1)

        return streak

    @staticmethod
    def _hydration_streak(db: Session, user_id: int) -> int:
        water_target = db.query(DailyTarget.water_target).filter(
            DailyTarget.user_id == user_id
        ).scalar() or 0

        if water_target <= 0:
            return 0

        today = date.today()
        since = today - timedelta(days=HabitService.MAX_STREAK_LOOKBACK_DAYS - 1)

        daily_totals = db.query(
            WaterLog.date,
            func.coalesce(func.sum(WaterLog.amount_ml), 0).label("total_ml")
        ).filter(
            WaterLog.user_id == user_id,
            WaterLog.date >= since,
            WaterLog.date <= today
        ).group_by(
            WaterLog.date
        ).all()

        success_dates = {row.date for row in daily_totals if row.total_ml >= water_target}
        return HabitService._streak_from_success_dates(success_dates)

    @staticmethod
    def _nutrition_streak(db: Session, user_id: int) -> int:
        target = db.query(DailyTarget.calorie_target).filter(
            DailyTarget.user_id == user_id
        ).scalar() or 0

        if target <= 0:
            return 0

        lower = target * 0.9
        upper = target * 1.1

        today = date.today()
        since = today - timedelta(days=HabitService.MAX_STREAK_LOOKBACK_DAYS - 1)

        daily_calories = db.query(
            FoodLog.date,
            func.coalesce(func.sum(FoodLog.calculated_calories), 0).label("total_calories")
        ).filter(
            FoodLog.user_id == user_id,
            FoodLog.date >= since,
            FoodLog.date <= today
        ).group_by(
            FoodLog.date
        ).all()

        success_dates = {
            row.date for row in daily_calories
            if lower <= row.total_calories <= upper
        }
        return HabitService._streak_from_success_dates(success_dates)

    @staticmethod
    def _workout_streak(db: Session, user_id: int) -> int:
        today = date.today()
        since = today - timedelta(days=HabitService.MAX_STREAK_LOOKBACK_DAYS - 1)

        workout_dates = db.query(
            WorkoutLog.date
        ).filter(
            WorkoutLog.user_id == user_id,
            WorkoutLog.date >= since,
            WorkoutLog.date <= today
        ).group_by(
            WorkoutLog.date
        ).all()

        success_dates = {row.date for row in workout_dates}
        return HabitService._streak_from_success_dates(success_dates)

    @staticmethod
    def get_streaks(db: Session, user_id: int):
        hydration_streak = HabitService._hydration_streak(db, user_id)
        nutrition_streak = HabitService._nutrition_streak(db, user_id)
        workout_streak = HabitService._workout_streak(db, user_id)

        return {
            "hydration_streak": hydration_streak,
            "nutrition_streak": nutrition_streak,
            "workout_streak": workout_streak
        }

    @staticmethod
    def create_habit_log(db: Session, user_id: int, habit_type: str, success: bool, log_date: date = None):
        """Create a new habit log entry."""
        if log_date is None:
            log_date = date.today()
        
        # Check if log already exists for this user, habit type, and date
        existing_log = db.query(HabitLog).filter(
            HabitLog.user_id == user_id,
            HabitLog.habit_type == habit_type,
            HabitLog.date == log_date
        ).first()
        
        if existing_log:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Habit log for '{habit_type}' on {log_date} already exists"
            )
        
        habit_log = HabitLog(
            user_id=user_id,
            habit_type=habit_type,
            success=success,
            date=log_date
        )
        
        db.add(habit_log)
        db.commit()
        db.refresh(habit_log)
        
        return habit_log

    @staticmethod
    def get_habit_history(db: Session, user_id: int, skip: int = 0, limit: int = 50):
        """Get paginated habit log history for a user."""
        query = db.query(HabitLog).filter(HabitLog.user_id == user_id)
        
        total = query.count()
        
        items = query.order_by(HabitLog.date.desc())\
                    .offset(skip)\
                    .limit(limit)\
                    .all()
        
        return {
            "items": items,
            "total": total,
            "skip": skip,
            "limit": limit,
            "has_more": (skip + len(items)) < total
        }

    @staticmethod
    def get_habit_by_id(db: Session, user_id: int, log_id: int):
        """Get a specific habit log by ID."""
        habit_log = db.query(HabitLog).filter(
            HabitLog.id == log_id,
            HabitLog.user_id == user_id
        ).first()
        
        if not habit_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Habit log not found"
            )
        
        return habit_log

    @staticmethod
    def delete_habit_log(db: Session, user_id: int, log_id: int):
        """Delete a habit log."""
        habit_log = db.query(HabitLog).filter(
            HabitLog.id == log_id,
            HabitLog.user_id == user_id
        ).first()
        
        if not habit_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Habit log not found"
            )
        
        db.delete(habit_log)
        db.commit()
        
        return {"message": "Habit log deleted successfully"}