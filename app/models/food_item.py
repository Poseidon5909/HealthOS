from sqlalchemy import Column, Integer, Float, String, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class FoodItem(Base):
  __tablename__ = "food_items"

  id = Column(Integer, primary_key=True, index=True)

  name = Column(String(255), index=True, nullable=False)

  calories_per_100g = Column(Float, nullable=False)
  protein_per_100g = Column(Float, nullable=False)
  fat_per_100g = Column(Float, nullable=False)
  carbs_per_100g = Column(Float, nullable=False)
  fiber_per_100g = Column(Float, nullable=False)

  created_at = Column(DateTime(timezone=True), server_default=func.now())
  
  # Relationships
  food_logs = relationship("FoodLog", back_populates="food")
  serving_sizes = relationship("ServingSize", back_populates="food_item", cascade="all, delete-orphan")
  
  __table_args__ = (
    CheckConstraint('calories_per_100g >= 0', name='check_calories_non_negative'),
    CheckConstraint('protein_per_100g >= 0', name='check_protein_non_negative'),
    CheckConstraint('fat_per_100g >= 0', name='check_fat_non_negative'),
    CheckConstraint('carbs_per_100g >= 0', name='check_carbs_non_negative'),
    CheckConstraint('fiber_per_100g >= 0', name='check_fiber_non_negative'),
  )