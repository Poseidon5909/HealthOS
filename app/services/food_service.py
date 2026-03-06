from sqlalchemy.orm import Session
from app.models.food_item import FoodItem
from typing import Optional

class FoodService:

  @staticmethod
  def seed_initial_data(db: Session):
    if db.query(FoodItem).first():
      return
    
    foods = [
      # Grains & Cereals
      {"name": "Rice (white, cooked)", "calories_per_100g": 130, "protein_per_100g": 2.7, "fat_per_100g": 0.3, "carbs_per_100g": 28, "fiber_per_100g": 0.4},
      {"name": "Rice (brown, cooked)", "calories_per_100g": 111, "protein_per_100g": 2.6, "fat_per_100g": 0.9, "carbs_per_100g": 23, "fiber_per_100g": 1.8},
      {"name": "Oats", "calories_per_100g": 389, "protein_per_100g": 16.9, "fat_per_100g": 6.9, "carbs_per_100g": 66.3, "fiber_per_100g": 10.6},
      {"name": "Quinoa (cooked)", "calories_per_100g": 120, "protein_per_100g": 4.4, "fat_per_100g": 1.9, "carbs_per_100g": 21.3, "fiber_per_100g": 2.8},
      {"name": "Whole Wheat Bread", "calories_per_100g": 247, "protein_per_100g": 13, "fat_per_100g": 3.4, "carbs_per_100g": 41, "fiber_per_100g": 7},
      {"name": "White Bread", "calories_per_100g": 265, "protein_per_100g": 9, "fat_per_100g": 3.2, "carbs_per_100g": 49, "fiber_per_100g": 2.7},
      {"name": "Pasta (cooked)", "calories_per_100g": 131, "protein_per_100g": 5, "fat_per_100g": 1.1, "carbs_per_100g": 25, "fiber_per_100g": 1.8},
      {"name": "Couscous (cooked)", "calories_per_100g": 112, "protein_per_100g": 3.8, "fat_per_100g": 0.2, "carbs_per_100g": 23, "fiber_per_100g": 1.4},
      {"name": "Corn (sweet)", "calories_per_100g": 86, "protein_per_100g": 3.3, "fat_per_100g": 1.4, "carbs_per_100g": 19, "fiber_per_100g": 2.4},
      {"name": "Barley (cooked)", "calories_per_100g": 123, "protein_per_100g": 2.3, "fat_per_100g": 0.4, "carbs_per_100g": 28, "fiber_per_100g": 3.8},
      
      # Proteins - Meat & Poultry
      {"name": "Chicken Breast", "calories_per_100g": 165, "protein_per_100g": 31, "fat_per_100g": 3.6, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Chicken Thigh", "calories_per_100g": 209, "protein_per_100g": 26, "fat_per_100g": 11, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Turkey", "calories_per_100g": 135, "protein_per_100g": 30, "fat_per_100g": 1.5, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Beef (lean)", "calories_per_100g": 250, "protein_per_100g": 26, "fat_per_100g": 15, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Pork Chop", "calories_per_100g": 242, "protein_per_100g": 27, "fat_per_100g": 14, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Lamb", "calories_per_100g": 294, "protein_per_100g": 25, "fat_per_100g": 21, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Duck", "calories_per_100g": 337, "protein_per_100g": 19, "fat_per_100g": 28, "carbs_per_100g": 0, "fiber_per_100g": 0},
      
      # Proteins - Seafood
      {"name": "Salmon", "calories_per_100g": 208, "protein_per_100g": 20, "fat_per_100g": 13, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Tuna", "calories_per_100g": 144, "protein_per_100g": 30, "fat_per_100g": 1, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Shrimp", "calories_per_100g": 99, "protein_per_100g": 24, "fat_per_100g": 0.3, "carbs_per_100g": 0.2, "fiber_per_100g": 0},
      {"name": "Cod", "calories_per_100g": 82, "protein_per_100g": 18, "fat_per_100g": 0.7, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Tilapia", "calories_per_100g": 128, "protein_per_100g": 26, "fat_per_100g": 3, "carbs_per_100g": 0, "fiber_per_100g": 0},
      
      # Proteins - Eggs & Dairy
      {"name": "Egg (whole)", "calories_per_100g": 155, "protein_per_100g": 13, "fat_per_100g": 11, "carbs_per_100g": 1.1, "fiber_per_100g": 0},
      {"name": "Egg White", "calories_per_100g": 52, "protein_per_100g": 11, "fat_per_100g": 0.2, "carbs_per_100g": 0.7, "fiber_per_100g": 0},
      {"name": "Milk (whole)", "calories_per_100g": 61, "protein_per_100g": 3.2, "fat_per_100g": 3.3, "carbs_per_100g": 4.8, "fiber_per_100g": 0},
      {"name": "Milk (skim)", "calories_per_100g": 34, "protein_per_100g": 3.4, "fat_per_100g": 0.1, "carbs_per_100g": 5, "fiber_per_100g": 0},
      {"name": "Greek Yogurt", "calories_per_100g": 59, "protein_per_100g": 10, "fat_per_100g": 0.4, "carbs_per_100g": 3.6, "fiber_per_100g": 0},
      {"name": "Cheddar Cheese", "calories_per_100g": 403, "protein_per_100g": 25, "fat_per_100g": 33, "carbs_per_100g": 1.3, "fiber_per_100g": 0},
      {"name": "Cottage Cheese", "calories_per_100g": 98, "protein_per_100g": 11, "fat_per_100g": 4.3, "carbs_per_100g": 3.4, "fiber_per_100g": 0},
      {"name": "Paneer", "calories_per_100g": 265, "protein_per_100g": 18, "fat_per_100g": 20, "carbs_per_100g": 1.2, "fiber_per_100g": 0},
      
      # Proteins - Plant-based
      {"name": "Tofu", "calories_per_100g": 76, "protein_per_100g": 8, "fat_per_100g": 4.8, "carbs_per_100g": 1.9, "fiber_per_100g": 0.3},
      {"name": "Tempeh", "calories_per_100g": 193, "protein_per_100g": 19, "fat_per_100g": 11, "carbs_per_100g": 9, "fiber_per_100g": 9},
      {"name": "Lentils (cooked)", "calories_per_100g": 116, "protein_per_100g": 9, "fat_per_100g": 0.4, "carbs_per_100g": 20, "fiber_per_100g": 8},
      {"name": "Chickpeas (cooked)", "calories_per_100g": 164, "protein_per_100g": 9, "fat_per_100g": 2.6, "carbs_per_100g": 27, "fiber_per_100g": 7.6},
      {"name": "Black Beans (cooked)", "calories_per_100g": 132, "protein_per_100g": 8.9, "fat_per_100g": 0.5, "carbs_per_100g": 24, "fiber_per_100g": 8.7},
      {"name": "Kidney Beans (cooked)", "calories_per_100g": 127, "protein_per_100g": 8.7, "fat_per_100g": 0.5, "carbs_per_100g": 23, "fiber_per_100g": 7.4},
      
      # Vegetables
      {"name": "Broccoli", "calories_per_100g": 34, "protein_per_100g": 2.8, "fat_per_100g": 0.4, "carbs_per_100g": 7, "fiber_per_100g": 2.6},
      {"name": "Spinach", "calories_per_100g": 23, "protein_per_100g": 2.9, "fat_per_100g": 0.4, "carbs_per_100g": 3.6, "fiber_per_100g": 2.2},
      {"name": "Kale", "calories_per_100g": 35, "protein_per_100g": 2.9, "fat_per_100g": 1.5, "carbs_per_100g": 4.4, "fiber_per_100g": 4.1},
      {"name": "Carrot", "calories_per_100g": 41, "protein_per_100g": 0.9, "fat_per_100g": 0.2, "carbs_per_100g": 10, "fiber_per_100g": 2.8},
      {"name": "Tomato", "calories_per_100g": 18, "protein_per_100g": 0.9, "fat_per_100g": 0.2, "carbs_per_100g": 3.9, "fiber_per_100g": 1.2},
      {"name": "Bell Pepper", "calories_per_100g": 31, "protein_per_100g": 1, "fat_per_100g": 0.3, "carbs_per_100g": 6, "fiber_per_100g": 2.1},
      {"name": "Cucumber", "calories_per_100g": 15, "protein_per_100g": 0.7, "fat_per_100g": 0.1, "carbs_per_100g": 3.6, "fiber_per_100g": 0.5},
      {"name": "Cauliflower", "calories_per_100g": 25, "protein_per_100g": 1.9, "fat_per_100g": 0.3, "carbs_per_100g": 5, "fiber_per_100g": 2},
      {"name": "Zucchini", "calories_per_100g": 17, "protein_per_100g": 1.2, "fat_per_100g": 0.3, "carbs_per_100g": 3.1, "fiber_per_100g": 1},
      {"name": "Eggplant", "calories_per_100g": 25, "protein_per_100g": 1, "fat_per_100g": 0.2, "carbs_per_100g": 6, "fiber_per_100g": 3},
      {"name": "Sweet Potato", "calories_per_100g": 86, "protein_per_100g": 1.6, "fat_per_100g": 0.1, "carbs_per_100g": 20, "fiber_per_100g": 3},
      {"name": "Potato (baked)", "calories_per_100g": 93, "protein_per_100g": 2.5, "fat_per_100g": 0.1, "carbs_per_100g": 21, "fiber_per_100g": 2.2},
      {"name": "Onion", "calories_per_100g": 40, "protein_per_100g": 1.1, "fat_per_100g": 0.1, "carbs_per_100g": 9, "fiber_per_100g": 1.7},
      {"name": "Mushroom", "calories_per_100g": 22, "protein_per_100g": 3.1, "fat_per_100g": 0.3, "carbs_per_100g": 3.3, "fiber_per_100g": 1},
      
      # Fruits
      {"name": "Apple", "calories_per_100g": 52, "protein_per_100g": 0.3, "fat_per_100g": 0.2, "carbs_per_100g": 14, "fiber_per_100g": 2.4},
      {"name": "Banana", "calories_per_100g": 89, "protein_per_100g": 1.1, "fat_per_100g": 0.3, "carbs_per_100g": 23, "fiber_per_100g": 2.6},
      {"name": "Orange", "calories_per_100g": 47, "protein_per_100g": 0.9, "fat_per_100g": 0.1, "carbs_per_100g": 12, "fiber_per_100g": 2.4},
      {"name": "Mango", "calories_per_100g": 60, "protein_per_100g": 0.8, "fat_per_100g": 0.4, "carbs_per_100g": 15, "fiber_per_100g": 1.6},
      {"name": "Pineapple", "calories_per_100g": 50, "protein_per_100g": 0.5, "fat_per_100g": 0.1, "carbs_per_100g": 13, "fiber_per_100g": 1.4},
      {"name": "Strawberry", "calories_per_100g": 32, "protein_per_100g": 0.7, "fat_per_100g": 0.3, "carbs_per_100g": 7.7, "fiber_per_100g": 2},
      {"name": "Blueberry", "calories_per_100g": 57, "protein_per_100g": 0.7, "fat_per_100g": 0.3, "carbs_per_100g": 14, "fiber_per_100g": 2.4},
      {"name": "Watermelon", "calories_per_100g": 30, "protein_per_100g": 0.6, "fat_per_100g": 0.2, "carbs_per_100g": 8, "fiber_per_100g": 0.4},
      {"name": "Grapes", "calories_per_100g": 69, "protein_per_100g": 0.7, "fat_per_100g": 0.2, "carbs_per_100g": 18, "fiber_per_100g": 0.9},
      {"name": "Avocado", "calories_per_100g": 160, "protein_per_100g": 2, "fat_per_100g": 15, "carbs_per_100g": 9, "fiber_per_100g": 7},
      {"name": "Papaya", "calories_per_100g": 43, "protein_per_100g": 0.5, "fat_per_100g": 0.3, "carbs_per_100g": 11, "fiber_per_100g": 1.7},
      {"name": "Pomegranate", "calories_per_100g": 83, "protein_per_100g": 1.7, "fat_per_100g": 1.2, "carbs_per_100g": 19, "fiber_per_100g": 4},
      
      # Nuts & Seeds
      {"name": "Almonds", "calories_per_100g": 579, "protein_per_100g": 21, "fat_per_100g": 50, "carbs_per_100g": 22, "fiber_per_100g": 12.5},
      {"name": "Walnuts", "calories_per_100g": 654, "protein_per_100g": 15, "fat_per_100g": 65, "carbs_per_100g": 14, "fiber_per_100g": 6.7},
      {"name": "Cashews", "calories_per_100g": 553, "protein_per_100g": 18, "fat_per_100g": 44, "carbs_per_100g": 30, "fiber_per_100g": 3.3},
      {"name": "Peanuts", "calories_per_100g": 567, "protein_per_100g": 26, "fat_per_100g": 49, "carbs_per_100g": 16, "fiber_per_100g": 8.5},
      {"name": "Peanut Butter", "calories_per_100g": 588, "protein_per_100g": 25, "fat_per_100g": 50, "carbs_per_100g": 20, "fiber_per_100g": 6},
      {"name": "Chia Seeds", "calories_per_100g": 486, "protein_per_100g": 17, "fat_per_100g": 31, "carbs_per_100g": 42, "fiber_per_100g": 34},
      {"name": "Flax Seeds", "calories_per_100g": 534, "protein_per_100g": 18, "fat_per_100g": 42, "carbs_per_100g": 29, "fiber_per_100g": 27},
      {"name": "Sunflower Seeds", "calories_per_100g": 584, "protein_per_100g": 21, "fat_per_100g": 51, "carbs_per_100g": 20, "fiber_per_100g": 8.6},
      
      # Fats & Oils
      {"name": "Olive Oil", "calories_per_100g": 884, "protein_per_100g": 0, "fat_per_100g": 100, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Coconut Oil", "calories_per_100g": 862, "protein_per_100g": 0, "fat_per_100g": 100, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Butter", "calories_per_100g": 717, "protein_per_100g": 0.9, "fat_per_100g": 81, "carbs_per_100g": 0.1, "fiber_per_100g": 0},
      {"name": "Ghee", "calories_per_100g": 900, "protein_per_100g": 0, "fat_per_100g": 100, "carbs_per_100g": 0, "fiber_per_100g": 0},
      
      # Snacks & Others
      {"name": "Dark Chocolate (70-85%)", "calories_per_100g": 598, "protein_per_100g": 7.8, "fat_per_100g": 43, "carbs_per_100g": 46, "fiber_per_100g": 11},
      {"name": "Honey", "calories_per_100g": 304, "protein_per_100g": 0.3, "fat_per_100g": 0, "carbs_per_100g": 82, "fiber_per_100g": 0.2},
      {"name": "Hummus", "calories_per_100g": 166, "protein_per_100g": 8, "fat_per_100g": 10, "carbs_per_100g": 14, "fiber_per_100g": 6},
      {"name": "Popcorn (air-popped)", "calories_per_100g": 387, "protein_per_100g": 13, "fat_per_100g": 4.5, "carbs_per_100g": 78, "fiber_per_100g": 15},
    ]
    
    for food_data in foods:
      food_item = FoodItem(**food_data)
      db.add(food_item)
    
    db.commit()
  
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

  @staticmethod
  def search_foods(db: Session, search: Optional[str] = None, 
                  skip: int = 0, limit: int = 50):
    """Search foods with optional query and pagination."""
    query = db.query(FoodItem)
    
    if search:
      query = query.filter(FoodItem.name.ilike(f"%{search}%"))
    
    # Get total count
    total = query.count()
    
    # Apply pagination and ordering
    items = query.order_by(FoodItem.name)\
                .offset(skip)\
                .limit(limit)\
                .all()
    
    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": (skip + len(items)) < total
    }