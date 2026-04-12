from pydantic import BaseModel, Field, validator
from datetime import date, datetime

class WaterLogCreate(BaseModel):
    amount_ml: int = Field(..., gt=0, le=5000, description="Amount of water in milliliters (max 5L per log)")
    
    @validator('amount_ml')
    def validate_amount(cls, v):
        if v < 1:
            raise ValueError("Water amount must be at least 1 ml")
        if v > 5000:
            raise ValueError("Single water log cannot exceed 5000 ml (5 liters)")
        return v

class WaterLogResponse(BaseModel):
    id: int
    user_id: int
    amount_ml: int
    date: date
    created_at: datetime

    class Config:
        from_attributes = True

class HydrationSummary(BaseModel):
    water_target_ml: float
    total_consumed_ml: float
    remaining_ml: float
    progress_percentage: float
