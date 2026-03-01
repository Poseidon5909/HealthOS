from pydantic import BaseModel


class FoodResponse(BaseModel):
    id: int
    name: str
    calories_per_100g: float
    protein_per_100g: float
    fat_per_100g: float
    carbs_per_100g: float
    fiber_per_100g: float | None

    class Config:
        from_attributes = True


class PortionRequest(BaseModel):
    grams: float