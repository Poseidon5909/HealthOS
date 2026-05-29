from pydantic import BaseModel, Field, validator, model_validator
from datetime import date, datetime
from typing import Optional, Literal

class FoodLogCreate(BaseModel):
  food_id: int = Field(..., gt=0, description="Food item ID")
  
  # Option 1: Log by grams
  quantity_grams: Optional[float] = Field(None, gt=0, le=5000, description="Quantity in grams (max 5kg)")
  
  # Option 2: Log by serving size
  serving_size_id: Optional[int] = Field(None, gt=0, description="Serving size ID")
  serving_quantity: Optional[float] = Field(None, gt=0, le=100, description="Number of servings")
  
  # Meal type
  meal_type: Optional[Literal["breakfast", "lunch", "dinner", "snack"]] = Field(
    None, 
    description="Type of meal: breakfast, lunch, dinner, or snack"
  )
  
  @model_validator(mode='after')
  def validate_quantity_method(self):
    # Either grams OR serving size must be provided, not both or neither
    has_grams = self.quantity_grams is not None
    has_serving = self.serving_size_id is not None and self.serving_quantity is not None
    
    if not has_grams and not has_serving:
      raise ValueError("Must provide either quantity_grams OR (serving_size_id + serving_quantity)")
    
    if has_grams and has_serving:
      raise ValueError("Cannot provide both quantity_grams and serving size. Choose one method.")
    
    # Validate serving_quantity if serving method is used
    if has_serving and self.serving_quantity is not None:
      if self.serving_quantity < 0.1:
        raise ValueError("Serving quantity must be at least 0.1")
      if self.serving_quantity > 100:
        raise ValueError("Serving quantity cannot exceed 100")
    
    return self

class FoodLogUpdate(BaseModel):
  food_id: Optional[int] = Field(None, gt=0, description="Food item ID")
  quantity_grams: Optional[float] = Field(None, gt=0, le=5000, description="Quantity in grams (max 5kg)")
  meal_type: Optional[Literal["breakfast", "lunch", "dinner", "snack"]] = Field(
    None,
    description="Type of meal: breakfast, lunch, dinner, or snack"
  )
  
  @validator('quantity_grams')
  def validate_quantity(cls, v):
    if v is not None:
      if v < 1:
        raise ValueError("Quantity must be at least 1 gram")
      if v > 5000:
        raise ValueError("Quantity cannot exceed 5000 grams (5 kg)")
    return v

class FoodLogResponse(BaseModel):
  id: int
  food_id: int
  food_name: Optional[str] = None
  quantity_grams: float
  meal_type: Optional[str] = None
  calculated_calories: float
  calculated_protein: float
  calculated_fat: float
  calculated_carbs: float
  date: date
  created_at: datetime

  class Config:
    from_attributes = True


class ServingSizeResponse(BaseModel):
  """Response schema for serving size information."""
  id: int
  food_id: int
  serving_name: str
  grams_per_serving: float
  
  class Config:
    from_attributes = True