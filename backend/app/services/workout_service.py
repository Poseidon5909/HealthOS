
from sqlalchemy.orm import Session
from datetime import date
from app.models.exercise import Exercise
from app.models.workout_log import WorkoutLog
from app.models.user import User
from app.models.user_profile import UserProfile
from fastapi import HTTPException
from typing import Optional

class WorkoutService:

    @staticmethod
    def log_workout(db: Session, user_id: int, exercise_id: int, duration_minutes: int):
        
        exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        
        if duration_minutes < 1:
            raise HTTPException(status_code=400, detail="Duration must be at least 1 minute")
        if duration_minutes > 720:
            raise HTTPException(status_code=400, detail="Duration cannot exceed 720 minutes (12 hours)")

        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")

        duration_hours = duration_minutes / 60

        # MET Formula
        calories = exercise.met_value * user_profile.weight * duration_hours

        workout_log = WorkoutLog(
            user_id=user_id,
            exercise_id=exercise_id,
            duration_minutes=duration_minutes,
            calories_burned=calories,
            date=date.today()
        )

        db.add(workout_log)
        db.commit()
        db.refresh(workout_log)

        return workout_log

    @staticmethod
    def get_daily_logs(db: Session, user_id: int, log_date: date):
        return db.query(WorkoutLog).filter(
            WorkoutLog.user_id == user_id,
            WorkoutLog.date == log_date
        ).all()

    @staticmethod
    def get_daily_total_burn(db: Session, user_id: int, log_date: date):
        logs = WorkoutService.get_daily_logs(db, user_id, log_date)
        return sum(log.calories_burned for log in logs)

    @staticmethod
    def get_by_id(db: Session, user_id: int, log_id: int):
        log = db.query(WorkoutLog).filter(
            WorkoutLog.id == log_id,
            WorkoutLog.user_id == user_id
        ).first()
        
        if not log:
            raise HTTPException(status_code=404, detail="Workout log not found")
        
        return log

    @staticmethod
    def update_log(db: Session, user_id: int, log_id: int, exercise_id: int = None, duration_minutes: int = None):
        log = WorkoutService.get_by_id(db, user_id, log_id)
        
        if exercise_id is not None:
            exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
            if not exercise:
                raise HTTPException(status_code=404, detail="Exercise not found")
            log.exercise_id = exercise_id
        
        if duration_minutes is not None:
            log.duration_minutes = duration_minutes
        

        exercise = db.query(Exercise).filter(Exercise.id == log.exercise_id).first()
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        duration_hours = log.duration_minutes / 60
        log.calories_burned = exercise.met_value * user_profile.weight * duration_hours
        
        db.commit()
        db.refresh(log)
        
        return log

    @staticmethod
    def delete_log(db: Session, user_id: int, log_id: int):
        log = WorkoutService.get_by_id(db, user_id, log_id)
        
        db.delete(log)
        db.commit()
        
        return {"message": "Workout log deleted successfully"}

    @staticmethod
    def get_logs_history(db: Session, user_id: int,
                        start_date: Optional[date] = None,
                        end_date: Optional[date] = None,
                        skip: int = 0,
                        limit: int = 50):
        """Get workout logs with optional date filtering and pagination."""
        query = db.query(WorkoutLog).filter(WorkoutLog.user_id == user_id)
        
        if start_date:
            query = query.filter(WorkoutLog.date >= start_date)
        if end_date:
            query = query.filter(WorkoutLog.date <= end_date)
        
        total = query.count()
        
        items = query.order_by(WorkoutLog.date.desc(), WorkoutLog.created_at.desc())\
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
    def search_exercises(db: Session, search: Optional[str] = None, 
                        category: Optional[str] = None,
                        skip: int = 0, limit: int = 50):
        """Search exercises with optional filters and pagination."""
        query = db.query(Exercise)
        
        if search:
            query = query.filter(Exercise.name.ilike(f"%{search}%"))
        if category:
            query = query.filter(Exercise.category.ilike(f"%{category}%"))
        
        total = query.count()
        
        items = query.order_by(Exercise.name)\
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