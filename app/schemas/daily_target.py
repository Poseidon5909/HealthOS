from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import Optional

class DailyTargetUpdate(BaseModel):
  calorie_target: Optional[int] = Field(None, ge=500, le=10000, description="Daily calorie target (500-10000)")
  protein_target: Optional[int] = Field(None, ge=10, le=500, description="Daily protein target in grams (10-500)")
  fat_target: Optional[int] = Field(None, ge=10, le=300, description="Daily fat target in grams (10-300)")
  carb_target: Optional[int] = Field(None, ge=20, le=1000, description="Daily carb target in grams (20-1000)")
  water_target: Optional[int] = Field(None, ge=500, le=10000, description="Daily water target in ml (500ml-10L)")
  
  @validator('calorie_target')
  def validate_calories(cls, v):
    if v is not None and (v < 500 or v > 10000):
      raise ValueError("Calorie target must be between 500 and 10,000")
    return v
  
  @validator('protein_target')
  def validate_protein(cls, v):
    if v is not None and (v < 10 or v > 500):
      raise ValueError("Protein target must be between 10 and 500 grams")
    return v
  
  @validator('fat_target')
  def validate_fat(cls, v):
    if v is not None and (v < 10 or v > 300):
      raise ValueError("Fat target must be between 10 and 300 grams")
    return v
  
  @validator('carb_target')
  def validate_carbs(cls, v):
    if v is not None and (v < 20 or v > 1000):
      raise ValueError("Carb target must be between 20 and 1000 grams")
    return v
  
  @validator('water_target')
  def validate_water(cls, v):
    if v is not None and (v < 500 or v > 10000):
      raise ValueError("Water target must be between 500 ml and 10 liters")
    return v

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
