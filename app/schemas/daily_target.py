from pydantic import BaseModel
from datetime import date, datetime

class DailyTargetResponse(BaseModel):
  id: int
  date: date
  calorie_target: int
  protein_target: int
  fat_target: int
  carb_target: int
  water_target: int
  created_at: datetime

  class Config:
    from_attributes = True
