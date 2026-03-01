from sqlalchemy.orm import Session
from app.models.food_item import FoodItem

class FoodService:

  @staticmethod
  def seed_initial_data(db: Session):
    if db.query(FoodItem).first():
      return
    
    foods = [
      {"name": "Rice (white)", "calories_per_100g": 130, "protein_per_100g": 2.7, "fat_per_100g": 0.3, "carbs_per_100g": 28, "fiber_per_100g": 0.4},
      {"name": "Chicken Breast", "calories_per_100g": 165, "protein_per_100g": 31, "fat_per_100g": 3.6, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Egg", "calories_per_100g": 155, "protein_per_100g": 13, "fat_per_100g": 11, "carbs_per_100g": 1.1, "fiber_per_100g": 0},
      {"name": "Banana", "calories_per_100g": 89, "protein_per_100g": 1.1, "fat_per_100g": 0.3, "carbs_per_100g": 23, "fiber_per_100g": 2.6},
      {"name": "Milk", "calories_per_100g": 52, "protein_per_100g": 3.4, "fat_per_100g": 1, "carbs_per_100g": 5, "fiber_per_100g": 0},
    ]
  
  @staticmethod
  def calculate_portion(food: FoodItem, grams: float):

    factor = grams / 100

    return {
        "calories": round(food.calories_per_100g * factor, 2),
        "protein": round(food.protein_per_100g * factor, 2),
        "fat": round(food.fat_per_100g * factor, 2),
        "carbs": round(food.carbs_per_100g * factor, 2),
        "fiber": round((food.fiber_per_100g or 0) * factor, 2)
      }