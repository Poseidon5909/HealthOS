from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, index=True)

  name = Column(String(100), nullable=False)

  email = Column(String(255), unique=True, index=True, nullable=False)

  password_hash = Column(String(255), nullable=False)
  
  is_active = Column(Boolean, default=True, nullable=False)
  
  email_verified = Column(Boolean, default=False, nullable=False)

  created_at = Column(DateTime(timezone=True), server_default=func.now())
  
  updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
  
  # Relationships
  profile = relationship("UserProfile", back_populates="user", uselist=False)
  food_logs = relationship("FoodLog", back_populates="user")
  workout_logs = relationship("WorkoutLog", back_populates="user")
  water_logs = relationship("WaterLog", back_populates="user")
  weight_logs = relationship("WeightLog", back_populates="user")
  habit_logs = relationship("HabitLog", back_populates="user")
  daily_targets = relationship("DailyTarget", back_populates="user")