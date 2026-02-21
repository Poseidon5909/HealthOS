from pydantic import BaseModel
from typing import Literal
from datetime import datetime

ActivityLevel = Literal["sedentary", "light", "moderate", "active", "very_active"]
GoalType = Literal["lose", "maintain", "gain"]

class ProfileBase(BaseModel):
  height: float
  weight: float
  age: float
  gender: str
  activity_level: str
  goal: str

class ProfileCreate(ProfileBase):
  pass

class ProfileUpdate(ProfileBase):
  pass

class ProfileResponse(ProfileBase):
  id: int
  updated_at: datetime

  class Config:
    from_attributes = True