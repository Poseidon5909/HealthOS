from pydantic import BaseModel
from typing import List, Optional


class ServingSizeResponse(BaseModel):
    id: int
    food_id: int
    serving_name: str
    grams_per_serving: float
    
    class Config:
        from_attributes = True


class FoodResponse(BaseModel):
    id: int
    name: str
    calories_per_100g: float
    protein_per_100g: float
    fat_per_100g: float
    carbs_per_100g: float
    fiber_per_100g: float | None
    serving_sizes: List[ServingSizeResponse] = []

    class Config:
        from_attributes = True


class PortionRequest(BaseModel):
    grams: float