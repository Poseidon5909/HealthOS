from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, Float, String, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class FoodLog(Base):
  __tablename__ = "food_logs"

  id = Column(Integer, primary_key=True, index=True)

  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  food_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)

  quantity_grams = Column(Float, nullable=False)
  meal_type = Column(String(50), nullable=True)  # breakfast, lunch, dinner, snack

  calculated_calories = Column(Float, nullable=False)
  calculated_protein = Column(Float, nullable=False)
  calculated_fat = Column(Float, nullable=False)
  calculated_carbs = Column(Float, nullable=False)

  date = Column(Date, nullable=False)

  created_at = Column(DateTime(timezone=True), server_default=func.now())

  user = relationship("User", back_populates="food_logs")
  food = relationship("FoodItem", back_populates="food_logs")

  @property
  def food_name(self):
    return self.food.name if self.food else None
  
  __table_args__ = (
    UniqueConstraint('user_id', 'food_id', 'created_at', name='uq_food_user_food_time'),
    CheckConstraint('quantity_grams > 0', name='check_quantity_positive'),
    CheckConstraint('calculated_calories >= 0', name='check_calories_non_negative'),
    CheckConstraint('calculated_protein >= 0', name='check_protein_non_negative'),
    CheckConstraint('calculated_fat >= 0', name='check_fat_non_negative'),
    CheckConstraint('calculated_carbs >= 0', name='check_carbs_non_negative'),
    Index('idx_food_user_date', 'user_id', 'date'),
  )