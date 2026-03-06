from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class UserProfile(Base):
  __tablename__ = "user_profiles"

  id = Column(Integer, primary_key=True, index=True)

  user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

  height = Column(Float, nullable=False)
  weight = Column(Float, nullable=False)
  age = Column(Float, nullable=False)
  gender = Column(String(10), nullable=False)
  activity_level = Column(String(10), nullable=False)
  goal = Column(String(20), nullable=False)

  updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

  user = relationship("User", back_populates="profile")
  
  __table_args__ = (
    CheckConstraint('height > 0', name='check_height_positive'),
    CheckConstraint('weight > 0', name='check_weight_positive'),
    CheckConstraint('age > 0', name='check_age_positive'),
  )