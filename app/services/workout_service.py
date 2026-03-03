# services/workout_service.py

from sqlalchemy.orm import Session
from datetime import date
from app.models.exercise import Exercise
from app.models.workout_log import WorkoutLog
from app.models.user import User
from app.models.user_profile import UserProfile
from fastapi import HTTPException

class WorkoutService:

    @staticmethod
    def log_workout(db: Session, user_id: int, exercise_id: int, duration_minutes: int):
        
        exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")

        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")

        # Convert minutes to hours
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