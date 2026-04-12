from pydantic import BaseModel, Field, validator
from typing import Literal
from datetime import datetime

ActivityLevel = Literal["sedentary", "light", "moderate", "active", "very_active"]
GoalType = Literal["lose", "maintain", "gain"]

class ProfileBase(BaseModel):
  height: float = Field(..., ge=50, le=300, description="Height in cm (50-300)")
  weight: float = Field(..., ge=20, le=500, description="Weight in kg (20-500)")
  age: float = Field(..., ge=10, le=120, description="Age in years (10-120)")
  gender: str = Field(..., description="Gender (male/female/other)")
  activity_level: ActivityLevel
  goal: GoalType
  
  @validator('height')
  def validate_height(cls, v):
    if v < 50 or v > 300:
      raise ValueError("Height must be between 50 and 300 cm")
    return v
  
  @validator('weight')
  def validate_weight(cls, v):
    if v < 20 or v > 500:
      raise ValueError("Weight must be between 20 and 500 kg")
    return v
  
  @validator('age')
  def validate_age(cls, v):
    if v < 10 or v > 120:
      raise ValueError("Age must be between 10 and 120 years")
    return v
  
  @validator('gender')
  def validate_gender(cls, v):
    allowed = ['male', 'female', 'other']
    if v.lower() not in allowed:
      raise ValueError(f"Gender must be one of: {', '.join(allowed)}")
    return v.lower()

class ProfileCreate(ProfileBase):
  pass

class ProfileUpdate(ProfileBase):
  pass

class ProfileResponse(ProfileBase):
  id: int
  updated_at: datetime

  class Config:
    from_attributes = True