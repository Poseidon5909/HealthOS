from pydantic import BaseModel
from typing import Dict, Any

class MacroTarget(BaseModel):
    consumed: float
    target: float

class CaloriesInfo(BaseModel):
    target: float
    consumed: float
    remaining: float

class MacrosInfo(BaseModel):
    protein: MacroTarget
    carbs: MacroTarget
    fat: MacroTarget

class HydrationInfo(BaseModel):
    consumed_ml: float
    target_ml: float
    progress_percentage: float

class WorkoutInfo(BaseModel):
    calories_burned: float
    duration_minutes: float

class WeightInfo(BaseModel):
    latest_weight: float
    weekly_change: float

class DashboardResponse(BaseModel):
    calories: CaloriesInfo
    macros: MacrosInfo
    hydration: HydrationInfo
    workout: WorkoutInfo
    weight: WeightInfo
    consistency: Dict[str, Any]

    class Config:
        from_attributes = True
