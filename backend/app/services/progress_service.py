from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from fastapi import HTTPException, status
from app.models.weight_log import WeightLog
from app.models.food_log import FoodLog
from app.models.workout_log import WorkoutLog
from app.models.water_log import WaterLog
from app.models.daily_target import DailyTarget
from typing import Optional


class ProgressService:

    @staticmethod
    def log_weight(db: Session, user_id: int, weight: float):

        if weight <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Weight must be positive"
            )
        
        if weight < 20:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Weight must be at least 20 kg"
            )
        
        if weight > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Weight cannot exceed 500 kg"
            )

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
    def get_weight_history(db: Session, user_id: int, skip: int = 0, limit: int = 100):
        return db.query(WeightLog)\
                 .filter(WeightLog.user_id == user_id)\
                 .order_by(WeightLog.date.asc())\
                 .offset(skip)\
                 .limit(limit)\
                 .all()

    @staticmethod
    def get_weight_history_filtered(db: Session, user_id: int,
                                    start_date: Optional[date] = None,
                                    end_date: Optional[date] = None,
                                    skip: int = 0,
                                    limit: int = 50):
        """Get weight logs with optional date filtering and pagination."""
        query = db.query(WeightLog).filter(WeightLog.user_id == user_id)
        
        if start_date:
            query = query.filter(WeightLog.date >= start_date)
        if end_date:
            query = query.filter(WeightLog.date <= end_date)
        
        total = query.count()
        
        items = query.order_by(WeightLog.date.desc())\
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
    def get_weight_by_id(db: Session, user_id: int, log_id: int):
        log = db.query(WeightLog).filter(
            WeightLog.id == log_id,
            WeightLog.user_id == user_id
        ).first()
        
        if not log:
            raise HTTPException(status_code=404, detail="Weight log not found")
        
        return log

    @staticmethod
    def update_weight(db: Session, user_id: int, log_id: int, weight: float = None, log_date: date = None):
        log = ProgressService.get_weight_by_id(db, user_id, log_id)
        
        if weight is not None:
            if weight <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Weight must be positive"
                )
            if weight < 20:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Weight must be at least 20 kg"
                )
            if weight > 500:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Weight cannot exceed 500 kg"
                )
            log.weight = weight
        
        if log_date is not None:
            if log_date > date.today():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Date cannot be in the future"
                )
            log.date = log_date
        
        db.commit()
        db.refresh(log)
        
        return log

    @staticmethod
    def delete_weight(db: Session, user_id: int, log_id: int):
        log = ProgressService.get_weight_by_id(db, user_id, log_id)
        
        db.delete(log)
        db.commit()
        
        return {"message": "Weight log deleted successfully"}

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

            total_calories = db.query(func.sum(FoodLog.calculated_calories))\
                .filter(
                    FoodLog.user_id == user_id,
                    FoodLog.date == day
                ).scalar() or 0

            lower = calorie_target * 0.9
            upper = calorie_target * 1.1

            if lower <= total_calories <= upper:
                macro_consistent_days += 1

        macro_consistency = (macro_consistent_days / 7) * 100

        workout_days = db.query(WorkoutLog.date)\
            .filter(
                WorkoutLog.user_id == user_id,
                WorkoutLog.date >= week_start
            )\
            .group_by(WorkoutLog.date)\
            .count()

        workout_consistency = (workout_days / 7) * 100

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