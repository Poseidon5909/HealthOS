from sqlalchemy import Column, Integer, String, Float, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Exercise(Base):
  __tablename__ = "exercises"

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)
  met_value = Column(Float, nullable=False)
  category = Column(String, nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  
  # Relationships
  workout_logs = relationship("WorkoutLog", back_populates="exercise")
  
  __table_args__ = (
    CheckConstraint('met_value > 0', name='check_met_value_positive'),
  )