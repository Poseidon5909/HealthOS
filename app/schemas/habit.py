from pydantic import BaseModel, Field
from datetime import date, datetime

class HabitLogCreate(BaseModel):
    habit_type: str = Field(..., description="Type of habit (e.g., 'sleep', 'meditation', 'reading')")
    success: bool = Field(..., description="Whether the habit was completed successfully")

class HabitLogResponse(BaseModel):
    id: int
    user_id: int
    habit_type: str
    success: bool
    date: date
    created_at: datetime

    class Config:
        from_attributes = True

class HabitStreak(BaseModel):
    habit_type: str
    current_streak: int
    longest_streak: int
    success_rate: float

class HabitStatusResponse(BaseModel):
    hydration_complete: bool
    nutrition_within_target: bool
    workout_completed: bool

class HabitStreaksResponse(BaseModel):
    hydration_streak: int
    nutrition_streak: int
    workout_streak: int
