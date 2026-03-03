from pydantic import BaseModel
from datetime import date, datetime

class FoodLogCreate(BaseModel):
  food_id: int
  quantity_grams: float

class FoodLogResponse(BaseModel):
  id: int
  food_id: int
  quantity_grams: float
  calculated_calories: float
  calculated_protein: float
  calculated_fat: float
  calculated_carbs: float
  date: date
  created_at: datetime

  class Config:
    from_attributes = True