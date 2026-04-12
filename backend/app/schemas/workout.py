from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import Optional

class WorkoutLogCreate(BaseModel):
    exercise_id: int = Field(..., gt=0, description="ID of the exercise")
    duration_minutes: int = Field(..., gt=0, le=720, description="Duration in minutes (max 12 hours)")
    
    @validator('duration_minutes')
    def validate_duration(cls, v):
        if v < 1:
            raise ValueError("Duration must be at least 1 minute")
        if v > 720:
            raise ValueError("Duration cannot exceed 720 minutes (12 hours)")
        return v

class WorkoutLogUpdate(BaseModel):
    exercise_id: Optional[int] = Field(None, gt=0, description="ID of the exercise")
    duration_minutes: Optional[int] = Field(None, gt=0, le=720, description="Duration in minutes (max 12 hours)")
    
    @validator('duration_minutes')
    def validate_duration(cls, v):
        if v is not None:
            if v < 1:
                raise ValueError("Duration must be at least 1 minute")
            if v > 720:
                raise ValueError("Duration cannot exceed 720 minutes (12 hours)")
        return v

class WorkoutLogResponse(BaseModel):
    id: int
    user_id: int
    exercise_id: int
    duration_minutes: int
    calories_burned: float
    date: date
    created_at: datetime

    class Config:
        from_attributes = True

class WorkoutLogWithExercise(WorkoutLogResponse):
    exercise_name: Optional[str] = None
    exercise_category: Optional[str] = None
