from sqlalchemy import Column, Integer, ForeignKey, Float, Date, DateTime, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class WorkoutLog(Base):
  __tablename__ = "workout_logs"

  id = Column(Integer, primary_key=True, index=True)

  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)

  duration_minutes = Column(Integer, nullable=False)
  calories_burned = Column(Float, nullable=False)

  date = Column(Date, nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())

  user = relationship("User", back_populates="workout_logs")
  exercise = relationship("Exercise", back_populates="workout_logs")
  
  __table_args__ = (
    UniqueConstraint('user_id', 'exercise_id', 'created_at', name='uq_workout_user_exercise_time'),
    CheckConstraint('duration_minutes > 0', name='check_duration_positive'),
    CheckConstraint('calories_burned >= 0', name='check_calories_non_negative'),
    Index('idx_workout_user_date', 'user_id', 'date'),
  )
