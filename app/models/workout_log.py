from sqlalchemy import Column, Integer, ForeignKey, Float, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class WorkoutLog(Base):
  __tablename__ = "workout_logs"

  id = Column(Integer, primary_key=True, index=True)

  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  exercise_id = Column(Integer, ForeignKey("excercises.id"), nullable=False)

  duration_minutes = Column(Integer, nullable=False)
  calories_burned = Column(Float, nullable=False)

  date = Column(Date, nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())

  user = relationship("User")
  exercise = relationship("Exercise")
