from sqlalchemy import Column, Integer, Float, String, DateTime
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