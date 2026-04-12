from pydantic import BaseModel, Field, validator
from datetime import date as date_type, datetime
from typing import Optional

class WeightLogCreate(BaseModel):
    weight: float = Field(..., gt=20, lt=500, description="Weight in kilograms (20-500 kg)")
    date: Optional[date_type] = None
    
    @validator('weight')
    def validate_weight(cls, v):
        if v < 20:
            raise ValueError("Weight must be at least 20 kg")
        if v > 500:
            raise ValueError("Weight cannot exceed 500 kg")
        return v
    
    @validator('date')
    def validate_date(cls, v):
        if v and v > date_type.today():
            raise ValueError("Date cannot be in the future")
        return v

class WeightLogUpdate(BaseModel):
    weight: Optional[float] = Field(None, gt=20, lt=500, description="Weight in kilograms (20-500 kg)")
    date: Optional[date_type] = None
    
    @validator('weight')
    def validate_weight(cls, v):
        if v is not None:
            if v < 20:
                raise ValueError("Weight must be at least 20 kg")
            if v > 500:
                raise ValueError("Weight cannot exceed 500 kg")
        return v
    
    @validator('date')
    def validate_date(cls, v):
        if v and v > date_type.today():
            raise ValueError("Date cannot be in the future")
        return v

class WeightLogResponse(BaseModel):
    id: int
    user_id: int
    weight: float
    date: date_type
    created_at: datetime

    class Config:
        from_attributes = True
