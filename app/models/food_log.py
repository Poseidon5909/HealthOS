from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class FoodLog(Base):
  __tablename__ = "food-_logs"

  id = Column(Integer,ForeignKey("user.id"), nullable=False)

  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  food_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)

  quantity_grams = Column(Float, nullable=False)

  calculated_calories = Column(Float, nullable=False)
  calculated_protien = Column(Float, nullable=False)
  calculated_fat = Column(Float, nullable=False)
  calculated_carbs = Column(Float, nullable=False)

  date = Column(Date, nullable=False)

  created_at = Column(DateTime(timezone=True), server_default=func.now())

  user = relationship("User", backref="food_logs")
  food = relationship("FoodItem", backref="food_logs")