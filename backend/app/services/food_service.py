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
      
      # Additional Proteins - More Meat Varieties
      {"name": "Ground Beef (90% lean)", "calories_per_100g": 176, "protein_per_100g": 20, "fat_per_100g": 10, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Ground Beef (80% lean)", "calories_per_100g": 254, "protein_per_100g": 17, "fat_per_100g": 20, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Beef Steak (sirloin)", "calories_per_100g": 271, "protein_per_100g": 27, "fat_per_100g": 17, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Beef Brisket", "calories_per_100g": 290, "protein_per_100g": 26, "fat_per_100g": 20, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Pork Tenderloin", "calories_per_100g": 143, "protein_per_100g": 26, "fat_per_100g": 3.5, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Pork Bacon", "calories_per_100g": 541, "protein_per_100g": 37, "fat_per_100g": 42, "carbs_per_100g": 1.4, "fiber_per_100g": 0},
      {"name": "Ham", "calories_per_100g": 145, "protein_per_100g": 21, "fat_per_100g": 6, "carbs_per_100g": 1.5, "fiber_per_100g": 0},
      {"name": "Sausage (pork)", "calories_per_100g": 301, "protein_per_100g": 13, "fat_per_100g": 27, "carbs_per_100g": 1, "fiber_per_100g": 0},
      {"name": "Hot Dog", "calories_per_100g": 290, "protein_per_100g": 10, "fat_per_100g": 26, "carbs_per_100g": 4, "fiber_per_100g": 0},
      {"name": "Chicken Wings", "calories_per_100g": 203, "protein_per_100g": 30, "fat_per_100g": 8.1, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Chicken Drumstick", "calories_per_100g": 172, "protein_per_100g": 28, "fat_per_100g": 5.7, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Ground Turkey", "calories_per_100g": 203, "protein_per_100g": 27, "fat_per_100g": 10, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Venison", "calories_per_100g": 158, "protein_per_100g": 30, "fat_per_100g": 3.2, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Bison", "calories_per_100g": 143, "protein_per_100g": 28, "fat_per_100g": 2.4, "carbs_per_100g": 0, "fiber_per_100g": 0},
      
      # More Seafood
      {"name": "Halibut", "calories_per_100g": 111, "protein_per_100g": 23, "fat_per_100g": 1.6, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Mackerel", "calories_per_100g": 305, "protein_per_100g": 19, "fat_per_100g": 25, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Sardines", "calories_per_100g": 208, "protein_per_100g": 25, "fat_per_100g": 11, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Anchovies", "calories_per_100g": 210, "protein_per_100g": 29, "fat_per_100g": 9.7, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Trout", "calories_per_100g": 148, "protein_per_100g": 21, "fat_per_100g": 6.6, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Catfish", "calories_per_100g": 105, "protein_per_100g": 18, "fat_per_100g": 2.8, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Sea Bass", "calories_per_100g": 97, "protein_per_100g": 18, "fat_per_100g": 2, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Crab", "calories_per_100g": 97, "protein_per_100g": 20, "fat_per_100g": 1.5, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Lobster", "calories_per_100g": 89, "protein_per_100g": 19, "fat_per_100g": 1, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Scallops", "calories_per_100g": 88, "protein_per_100g": 17, "fat_per_100g": 0.8, "carbs_per_100g": 2.4, "fiber_per_100g": 0},
      {"name": "Mussels", "calories_per_100g": 86, "protein_per_100g": 12, "fat_per_100g": 2.2, "carbs_per_100g": 3.7, "fiber_per_100g": 0},
      {"name": "Oysters", "calories_per_100g": 68, "protein_per_100g": 7, "fat_per_100g": 2.5, "carbs_per_100g": 3.9, "fiber_per_100g": 0},
      {"name": "Squid", "calories_per_100g": 92, "protein_per_100g": 16, "fat_per_100g": 1.4, "carbs_per_100g": 3.1, "fiber_per_100g": 0},
      {"name": "Octopus", "calories_per_100g": 82, "protein_per_100g": 15, "fat_per_100g": 1, "carbs_per_100g": 2.2, "fiber_per_100g": 0},
      
      # More Dairy Products
      {"name": "Mozzarella Cheese", "calories_per_100g": 280, "protein_per_100g": 28, "fat_per_100g": 17, "carbs_per_100g": 3.1, "fiber_per_100g": 0},
      {"name": "Parmesan Cheese", "calories_per_100g": 431, "protein_per_100g": 38, "fat_per_100g": 29, "carbs_per_100g": 4.1, "fiber_per_100g": 0},
      {"name": "Feta Cheese", "calories_per_100g": 264, "protein_per_100g": 14, "fat_per_100g": 21, "carbs_per_100g": 4.1, "fiber_per_100g": 0},
      {"name": "Cream Cheese", "calories_per_100g": 342, "protein_per_100g": 6, "fat_per_100g": 34, "carbs_per_100g": 4.1, "fiber_per_100g": 0},
      {"name": "Swiss Cheese", "calories_per_100g": 380, "protein_per_100g": 27, "fat_per_100g": 28, "carbs_per_100g": 5.4, "fiber_per_100g": 0},
      {"name": "Blue Cheese", "calories_per_100g": 353, "protein_per_100g": 21, "fat_per_100g": 29, "carbs_per_100g": 2.3, "fiber_per_100g": 0},
      {"name": "Ricotta Cheese", "calories_per_100g": 174, "protein_per_100g": 11, "fat_per_100g": 13, "carbs_per_100g": 3, "fiber_per_100g": 0},
      {"name": "Sour Cream", "calories_per_100g": 193, "protein_per_100g": 2.4, "fat_per_100g": 19, "carbs_per_100g": 4.6, "fiber_per_100g": 0},
      {"name": "Heavy Cream", "calories_per_100g": 340, "protein_per_100g": 2.1, "fat_per_100g": 36, "carbs_per_100g": 2.8, "fiber_per_100g": 0},
      {"name": "Whipped Cream", "calories_per_100g": 257, "protein_per_100g": 2.2, "fat_per_100g": 22, "carbs_per_100g": 13, "fiber_per_100g": 0},
      {"name": "Condensed Milk", "calories_per_100g": 321, "protein_per_100g": 7.9, "fat_per_100g": 8.7, "carbs_per_100g": 54, "fiber_per_100g": 0},
      {"name": "Evaporated Milk", "calories_per_100g": 135, "protein_per_100g": 6.8, "fat_per_100g": 7.6, "carbs_per_100g": 10, "fiber_per_100g": 0},
      {"name": "Almond Milk (unsweetened)", "calories_per_100g": 15, "protein_per_100g": 0.6, "fat_per_100g": 1.1, "carbs_per_100g": 0.6, "fiber_per_100g": 0.3},
      {"name": "Soy Milk", "calories_per_100g": 54, "protein_per_100g": 3.3, "fat_per_100g": 1.8, "carbs_per_100g": 6, "fiber_per_100g": 0.6},
      {"name": "Oat Milk", "calories_per_100g": 47, "protein_per_100g": 1, "fat_per_100g": 1.5, "carbs_per_100g": 7.7, "fiber_per_100g": 0.8},
      {"name": "Coconut Milk", "calories_per_100g": 230, "protein_per_100g": 2.3, "fat_per_100g": 24, "carbs_per_100g": 6, "fiber_per_100g": 2.2},
      
      # More Vegetables
      {"name": "Asparagus", "calories_per_100g": 20, "protein_per_100g": 2.2, "fat_per_100g": 0.1, "carbs_per_100g": 3.9, "fiber_per_100g": 2.1},
      {"name": "Brussels Sprouts", "calories_per_100g": 43, "protein_per_100g": 3.4, "fat_per_100g": 0.3, "carbs_per_100g": 9, "fiber_per_100g": 3.8},
      {"name": "Cabbage", "calories_per_100g": 25, "protein_per_100g": 1.3, "fat_per_100g": 0.1, "carbs_per_100g": 5.8, "fiber_per_100g": 2.5},
      {"name": "Celery", "calories_per_100g": 16, "protein_per_100g": 0.7, "fat_per_100g": 0.2, "carbs_per_100g": 3, "fiber_per_100g": 1.6},
      {"name": "Green Beans", "calories_per_100g": 31, "protein_per_100g": 1.8, "fat_per_100g": 0.2, "carbs_per_100g": 7, "fiber_per_100g": 2.7},
      {"name": "Peas", "calories_per_100g": 81, "protein_per_100g": 5.4, "fat_per_100g": 0.4, "carbs_per_100g": 14, "fiber_per_100g": 5.7},
      {"name": "Radish", "calories_per_100g": 16, "protein_per_100g": 0.7, "fat_per_100g": 0.1, "carbs_per_100g": 3.4, "fiber_per_100g": 1.6},
      {"name": "Beets", "calories_per_100g": 43, "protein_per_100g": 1.6, "fat_per_100g": 0.2, "carbs_per_100g": 10, "fiber_per_100g": 2.8},
      {"name": "Turnip", "calories_per_100g": 28, "protein_per_100g": 0.9, "fat_per_100g": 0.1, "carbs_per_100g": 6.4, "fiber_per_100g": 1.8},
      {"name": "Butternut Squash", "calories_per_100g": 45, "protein_per_100g": 1, "fat_per_100g": 0.1, "carbs_per_100g": 12, "fiber_per_100g": 2},
      {"name": "Pumpkin", "calories_per_100g": 26, "protein_per_100g": 1, "fat_per_100g": 0.1, "carbs_per_100g": 6.5, "fiber_per_100g": 0.5},
      {"name": "Artichoke", "calories_per_100g": 47, "protein_per_100g": 3.3, "fat_per_100g": 0.2, "carbs_per_100g": 11, "fiber_per_100g": 5.4},
      {"name": "Leek", "calories_per_100g": 61, "protein_per_100g": 1.5, "fat_per_100g": 0.3, "carbs_per_100g": 14, "fiber_per_100g": 1.8},
      {"name": "Okra", "calories_per_100g": 33, "protein_per_100g": 1.9, "fat_per_100g": 0.2, "carbs_per_100g": 7.5, "fiber_per_100g": 3.2},
      {"name": "Arugula", "calories_per_100g": 25, "protein_per_100g": 2.6, "fat_per_100g": 0.7, "carbs_per_100g": 3.7, "fiber_per_100g": 1.6},
      {"name": "Lettuce (iceberg)", "calories_per_100g": 14, "protein_per_100g": 0.9, "fat_per_100g": 0.1, "carbs_per_100g": 3, "fiber_per_100g": 1.2},
      {"name": "Lettuce (romaine)", "calories_per_100g": 17, "protein_per_100g": 1.2, "fat_per_100g": 0.3, "carbs_per_100g": 3.3, "fiber_per_100g": 2.1},
      {"name": "Swiss Chard", "calories_per_100g": 19, "protein_per_100g": 1.8, "fat_per_100g": 0.2, "carbs_per_100g": 3.7, "fiber_per_100g": 1.6},
      {"name": "Bok Choy", "calories_per_100g": 13, "protein_per_100g": 1.5, "fat_per_100g": 0.2, "carbs_per_100g": 2.2, "fiber_per_100g": 1},
      {"name": "Collard Greens", "calories_per_100g": 32, "protein_per_100g": 3, "fat_per_100g": 0.6, "carbs_per_100g": 5.4, "fiber_per_100g": 4},
      
      # More Fruits
      {"name": "Kiwi", "calories_per_100g": 61, "protein_per_100g": 1.1, "fat_per_100g": 0.5, "carbs_per_100g": 15, "fiber_per_100g": 3},
      {"name": "Pear", "calories_per_100g": 57, "protein_per_100g": 0.4, "fat_per_100g": 0.1, "carbs_per_100g": 15, "fiber_per_100g": 3.1},
      {"name": "Peach", "calories_per_100g": 39, "protein_per_100g": 0.9, "fat_per_100g": 0.3, "carbs_per_100g": 10, "fiber_per_100g": 1.5},
      {"name": "Plum", "calories_per_100g": 46, "protein_per_100g": 0.7, "fat_per_100g": 0.3, "carbs_per_100g": 11, "fiber_per_100g": 1.4},
      {"name": "Apricot", "calories_per_100g": 48, "protein_per_100g": 1.4, "fat_per_100g": 0.4, "carbs_per_100g": 11, "fiber_per_100g": 2},
      {"name": "Cherry", "calories_per_100g": 63, "protein_per_100g": 1.1, "fat_per_100g": 0.2, "carbs_per_100g": 16, "fiber_per_100g": 2.1},
      {"name": "Raspberry", "calories_per_100g": 52, "protein_per_100g": 1.2, "fat_per_100g": 0.7, "carbs_per_100g": 12, "fiber_per_100g": 6.5},
      {"name": "Blackberry", "calories_per_100g": 43, "protein_per_100g": 1.4, "fat_per_100g": 0.5, "carbs_per_100g": 10, "fiber_per_100g": 5.3},
      {"name": "Cranberry", "calories_per_100g": 46, "protein_per_100g": 0.4, "fat_per_100g": 0.1, "carbs_per_100g": 12, "fiber_per_100g": 4.6},
      {"name": "Grapefruit", "calories_per_100g": 42, "protein_per_100g": 0.8, "fat_per_100g": 0.1, "carbs_per_100g": 11, "fiber_per_100g": 1.6},
      {"name": "Lemon", "calories_per_100g": 29, "protein_per_100g": 1.1, "fat_per_100g": 0.3, "carbs_per_100g": 9, "fiber_per_100g": 2.8},
      {"name": "Lime", "calories_per_100g": 30, "protein_per_100g": 0.7, "fat_per_100g": 0.2, "carbs_per_100g": 11, "fiber_per_100g": 2.8},
      {"name": "Cantaloupe", "calories_per_100g": 34, "protein_per_100g": 0.8, "fat_per_100g": 0.2, "carbs_per_100g": 8, "fiber_per_100g": 0.9},
      {"name": "Honeydew", "calories_per_100g": 36, "protein_per_100g": 0.5, "fat_per_100g": 0.1, "carbs_per_100g": 9, "fiber_per_100g": 0.8},
      {"name": "Coconut (meat)", "calories_per_100g": 354, "protein_per_100g": 3.3, "fat_per_100g": 33, "carbs_per_100g": 15, "fiber_per_100g": 9},
      {"name": "Dragon Fruit", "calories_per_100g": 60, "protein_per_100g": 1.2, "fat_per_100g": 0, "carbs_per_100g": 13, "fiber_per_100g": 3},
      {"name": "Guava", "calories_per_100g": 68, "protein_per_100g": 2.6, "fat_per_100g": 1, "carbs_per_100g": 14, "fiber_per_100g": 5.4},
      {"name": "Lychee", "calories_per_100g": 66, "protein_per_100g": 0.8, "fat_per_100g": 0.4, "carbs_per_100g": 17, "fiber_per_100g": 1.3},
      {"name": "Passion Fruit", "calories_per_100g": 97, "protein_per_100g": 2.2, "fat_per_100g": 0.7, "carbs_per_100g": 23, "fiber_per_100g": 10},
      {"name": "Persimmon", "calories_per_100g": 70, "protein_per_100g": 0.6, "fat_per_100g": 0.2, "carbs_per_100g": 19, "fiber_per_100g": 3.6},
      {"name": "Fig", "calories_per_100g": 74, "protein_per_100g": 0.8, "fat_per_100g": 0.3, "carbs_per_100g": 19, "fiber_per_100g": 2.9},
      {"name": "Dates", "calories_per_100g": 282, "protein_per_100g": 2.5, "fat_per_100g": 0.4, "carbs_per_100g": 75, "fiber_per_100g": 8},
      {"name": "Raisins", "calories_per_100g": 299, "protein_per_100g": 3.1, "fat_per_100g": 0.5, "carbs_per_100g": 79, "fiber_per_100g": 3.7},
      {"name": "Prunes", "calories_per_100g": 240, "protein_per_100g": 2.2, "fat_per_100g": 0.4, "carbs_per_100g": 64, "fiber_per_100g": 7.1},
      
      # More Nuts & Seeds
      {"name": "Pistachios", "calories_per_100g": 560, "protein_per_100g": 20, "fat_per_100g": 45, "carbs_per_100g": 28, "fiber_per_100g": 10},
      {"name": "Pecans", "calories_per_100g": 691, "protein_per_100g": 9, "fat_per_100g": 72, "carbs_per_100g": 14, "fiber_per_100g": 9.6},
      {"name": "Hazelnuts", "calories_per_100g": 628, "protein_per_100g": 15, "fat_per_100g": 61, "carbs_per_100g": 17, "fiber_per_100g": 9.7},
      {"name": "Macadamia Nuts", "calories_per_100g": 718, "protein_per_100g": 7.9, "fat_per_100g": 76, "carbs_per_100g": 14, "fiber_per_100g": 8.6},
      {"name": "Brazil Nuts", "calories_per_100g": 656, "protein_per_100g": 14, "fat_per_100g": 66, "carbs_per_100g": 12, "fiber_per_100g": 7.5},
      {"name": "Pine Nuts", "calories_per_100g": 673, "protein_per_100g": 14, "fat_per_100g": 68, "carbs_per_100g": 13, "fiber_per_100g": 3.7},
      {"name": "Pumpkin Seeds", "calories_per_100g": 559, "protein_per_100g": 30, "fat_per_100g": 49, "carbs_per_100g": 10, "fiber_per_100g": 6},
      {"name": "Sesame Seeds", "calories_per_100g": 573, "protein_per_100g": 18, "fat_per_100g": 50, "carbs_per_100g": 23, "fiber_per_100g": 12},
      {"name": "Hemp Seeds", "calories_per_100g": 553, "protein_per_100g": 32, "fat_per_100g": 49, "carbs_per_100g": 8.7, "fiber_per_100g": 4},
      {"name": "Almond Butter", "calories_per_100g": 614, "protein_per_100g": 21, "fat_per_100g": 56, "carbs_per_100g": 19, "fiber_per_100g": 10},
      {"name": "Cashew Butter", "calories_per_100g": 587, "protein_per_100g": 18, "fat_per_100g": 49, "carbs_per_100g": 27, "fiber_per_100g": 2},
      
      # Cereals & Breakfast
      {"name": "Cornflakes", "calories_per_100g": 370, "protein_per_100g": 7.5, "fat_per_100g": 1, "carbs_per_100g": 84, "fiber_per_100g": 3},
      {"name": "Granola", "calories_per_100g": 471, "protein_per_100g": 13, "fat_per_100g": 20, "carbs_per_100g": 64, "fiber_per_100g": 8},
      {"name": "Muesli", "calories_per_100g": 364, "protein_per_100g": 11, "fat_per_100g": 5.5, "carbs_per_100g": 72, "fiber_per_100g": 7.7},
      {"name": "Bran Flakes", "calories_per_100g": 323, "protein_per_100g": 10, "fat_per_100g": 2, "carbs_per_100g": 70, "fiber_per_100g": 15},
      {"name": "Wheat Bran", "calories_per_100g": 216, "protein_per_100g": 16, "fat_per_100g": 4.3, "carbs_per_100g": 65, "fiber_per_100g": 43},
      {"name": "Oat Bran", "calories_per_100g": 246, "protein_per_100g": 17, "fat_per_100g": 7, "carbs_per_100g": 66, "fiber_per_100g": 15},
      {"name": "Cream of Wheat", "calories_per_100g": 371, "protein_per_100g": 10, "fat_per_100g": 1.1, "carbs_per_100g": 79, "fiber_per_100g": 3.3},
      
      # Breads & Baked Goods
      {"name": "Bagel", "calories_per_100g": 257, "protein_per_100g": 10, "fat_per_100g": 1.4, "carbs_per_100g": 50, "fiber_per_100g": 2.3},
      {"name": "Croissant", "calories_per_100g": 406, "protein_per_100g": 7.8, "fat_per_100g": 21, "carbs_per_100g": 46, "fiber_per_100g": 2.6},
      {"name": "English Muffin", "calories_per_100g": 235, "protein_per_100g": 8, "fat_per_100g": 2, "carbs_per_100g": 47, "fiber_per_100g": 2.6},
      {"name": "Pita Bread", "calories_per_100g": 275, "protein_per_100g": 9, "fat_per_100g": 1.2, "carbs_per_100g": 56, "fiber_per_100g": 2.2},
      {"name": "Sourdough Bread", "calories_per_100g": 259, "protein_per_100g": 10, "fat_per_100g": 1.6, "carbs_per_100g": 50, "fiber_per_100g": 2.1},
      {"name": "Rye Bread", "calories_per_100g": 259, "protein_per_100g": 8.5, "fat_per_100g": 3.3, "carbs_per_100g": 48, "fiber_per_100g": 5.8},
      {"name": "Naan", "calories_per_100g": 310, "protein_per_100g": 9, "fat_per_100g": 8, "carbs_per_100g": 51, "fiber_per_100g": 2},
      {"name": "Tortilla (flour)", "calories_per_100g": 304, "protein_per_100g": 8, "fat_per_100g": 7.2, "carbs_per_100g": 50, "fiber_per_100g": 3},
      {"name": "Tortilla (corn)", "calories_per_100g": 218, "protein_per_100g": 5.7, "fat_per_100g": 2.9, "carbs_per_100g": 44, "fiber_per_100g": 4.5},
      {"name": "Crackers (whole wheat)", "calories_per_100g": 436, "protein_per_100g": 10, "fat_per_100g": 14, "carbs_per_100g": 70, "fiber_per_100g": 7},
      {"name": "Pretzels", "calories_per_100g": 380, "protein_per_100g": 10, "fat_per_100g": 3, "carbs_per_100g": 80, "fiber_per_100g": 2},
      
      # Condiments & Sauces
      {"name": "Ketchup", "calories_per_100g": 101, "protein_per_100g": 1.2, "fat_per_100g": 0.1, "carbs_per_100g": 27, "fiber_per_100g": 0.3},
      {"name": "Mustard", "calories_per_100g": 66, "protein_per_100g": 3.7, "fat_per_100g": 3.3, "carbs_per_100g": 7.7, "fiber_per_100g": 3.6},  
      {"name": "Mayonnaise", "calories_per_100g": 680, "protein_per_100g": 1.1, "fat_per_100g": 75, "carbs_per_100g": 0.6, "fiber_per_100g": 0},
      {"name": "Ranch Dressing", "calories_per_100g": 479, "protein_per_100g": 1.1, "fat_per_100g": 50, "carbs_per_100g": 7, "fiber_per_100g": 0},
      {"name": "BBQ Sauce", "calories_per_100g": 172, "protein_per_100g": 1.2, "fat_per_100g": 0.8, "carbs_per_100g": 41, "fiber_per_100g": 1.2},
      {"name": "Soy Sauce", "calories_per_100g": 53, "protein_per_100g": 6, "fat_per_100g": 0, "carbs_per_100g": 4.9, "fiber_per_100g": 0.8},
      {"name": "Hot Sauce", "calories_per_100g": 12, "protein_per_100g": 0.5, "fat_per_100g": 0.1, "carbs_per_100g": 2.7, "fiber_per_100g": 0.6},
      {"name": "Salsa", "calories_per_100g": 36, "protein_per_100g": 1.5, "fat_per_100g": 0.2, "carbs_per_100g": 7.8, "fiber_per_100g": 1.9},
      {"name": "Marinara Sauce", "calories_per_100g": 50, "protein_per_100g": 1.4, "fat_per_100g": 1.3, "carbs_per_100g": 9, "fiber_per_100g": 1.8},
      {"name": "Alfredo Sauce", "calories_per_100g": 200, "protein_per_100g": 5, "fat_per_100g": 18, "carbs_per_100g": 5, "fiber_per_100g": 0.2},
      {"name": "Pesto", "calories_per_100g": 420, "protein_per_100g": 5, "fat_per_100g": 41, "carbs_per_100g": 6, "fiber_per_100g": 1.5},
      {"name": "Tahini", "calories_per_100g": 595, "protein_per_100g": 17, "fat_per_100g": 54, "carbs_per_100g": 21, "fiber_per_100g": 9.3},
      
      # Snacks & Processed Foods
      {"name": "Potato Chips", "calories_per_100g": 536, "protein_per_100g": 6.6, "fat_per_100g": 35, "carbs_per_100g": 53, "fiber_per_100g": 4.8},
      {"name": "Tortilla Chips", "calories_per_100g": 503, "protein_per_100g": 7, "fat_per_100g": 25, "carbs_per_100g": 63, "fiber_per_100g": 5.3},
      {"name": "Cheese Puffs", "calories_per_100g": 559, "protein_per_100g": 6, "fat_per_100g": 37, "carbs_per_100g": 52, "fiber_per_100g": 2.3},
      {"name": "Popcorn (oil-popped)", "calories_per_100g": 500, "protein_per_100g": 9, "fat_per_100g": 28, "carbs_per_100g": 58, "fiber_per_100g": 10},
      {"name": "Rice Cakes", "calories_per_100g": 387, "protein_per_100g": 8.2, "fat_per_100g": 3.5, "carbs_per_100g": 81, "fiber_per_100g": 4.2},
      {"name": "Graham Crackers", "calories_per_100g": 423, "protein_per_100g": 6.8, "fat_per_100g": 10, "carbs_per_100g": 78, "fiber_per_100g": 3.4},
      {"name": "Oreo Cookies", "calories_per_100g": 478, "protein_per_100g": 4.3, "fat_per_100g": 19, "carbs_per_100g": 70, "fiber_per_100g": 2.8},
      {"name": "Animal Crackers", "calories_per_100g": 446, "protein_per_100g": 7.1, "fat_per_100g": 12, "carbs_per_100g": 76, "fiber_per_100g": 1.4},
      {"name": "Granola Bar", "calories_per_100g": 404, "protein_per_100g": 5.8, "fat_per_100g": 13, "carbs_per_100g": 69, "fiber_per_100g": 4.5},
      {"name": "Protein Bar", "calories_per_100g": 400, "protein_per_100g": 20, "fat_per_100g": 15, "carbs_per_100g": 50, "fiber_per_100g": 5},
      {"name": "Brownie", "calories_per_100g": 466, "protein_per_100g": 6, "fat_per_100g": 23, "carbs_per_100g": 60, "fiber_per_100g": 3},
      {"name": "Muffin (blueberry)", "calories_per_100g": 377, "protein_per_100g": 5.9, "fat_per_100g": 18, "carbs_per_100g": 49, "fiber_per_100g": 2.3},
      {"name": "Donut (glazed)", "calories_per_100g": 452, "protein_per_100g": 5.3, "fat_per_100g": 25, "carbs_per_100g": 51, "fiber_per_100g": 1.5},
      {"name": "Pancake", "calories_per_100g": 227, "protein_per_100g": 6.4, "fat_per_100g": 9.7, "carbs_per_100g": 28, "fiber_per_100g": 1.2},
      {"name": "Waffle", "calories_per_100g": 305, "protein_per_100g": 7.4, "fat_per_100g": 13, "carbs_per_100g": 39, "fiber_per_100g": 1.7},
      {"name": "French Toast", "calories_per_100g": 226, "protein_per_100g": 7.6, "fat_per_100g": 10, "carbs_per_100g": 27, "fiber_per_100g": 1.2},
      
      # Fast Food (Popular Items)
      {"name": "Pizza (cheese)", "calories_per_100g": 266, "protein_per_100g": 11, "fat_per_100g": 10, "carbs_per_100g": 33, "fiber_per_100g": 2.3},
      {"name": "Pizza (pepperoni)", "calories_per_100g": 296, "protein_per_100g": 12, "fat_per_100g": 13, "carbs_per_100g": 32, "fiber_per_100g": 2.2},
      {"name": "Hamburger", "calories_per_100g": 295, "protein_per_100g": 17, "fat_per_100g": 14, "carbs_per_100g": 25, "fiber_per_100g": 1.5},
      {"name": "Cheeseburger", "calories_per_100g": 313, "protein_per_100g": 16, "fat_per_100g": 16, "carbs_per_100g": 25, "fiber_per_100g": 1.4},
      {"name": "French Fries", "calories_per_100g": 312, "protein_per_100g": 3.4, "fat_per_100g": 15, "carbs_per_100g": 41, "fiber_per_100g": 3.8},
      {"name": "Onion Rings", "calories_per_100g": 407, "protein_per_100g": 5.3, "fat_per_100g": 22, "carbs_per_100g": 48, "fiber_per_100g": 2.7},
      {"name": "Chicken Nuggets", "calories_per_100g": 296, "protein_per_100g": 15, "fat_per_100g": 18, "carbs_per_100g": 18, "fiber_per_100g": 1.2},
      {"name": "Fried Chicken", "calories_per_100g": 246, "protein_per_100g": 19, "fat_per_100g": 15, "carbs_per_100g": 9, "fiber_per_100g": 0.5},
      {"name": "Fish Sandwich", "calories_per_100g": 257, "protein_per_100g": 12, "fat_per_100g": 10, "carbs_per_100g": 30, "fiber_per_100g": 1.5},
      {"name": "Taco", "calories_per_100g": 226, "protein_per_100g": 9.7, "fat_per_100g": 12, "carbs_per_100g": 21, "fiber_per_100g": 3.2},
      {"name": "Burrito", "calories_per_100g": 180, "protein_per_100g": 7.6, "fat_per_100g": 6.3, "carbs_per_100g": 23, "fiber_per_100g": 3.1},
      {"name": "Nachos", "calories_per_100g": 304, "protein_per_100g": 7.5, "fat_per_100g": 17, "carbs_per_100g": 32, "fiber_per_100g": 3.5},
      {"name": "Sub Sandwich", "calories_per_100g": 252, "protein_per_100g": 12, "fat_per_100g": 9, "carbs_per_100g": 31, "fiber_per_100g": 2.5},
      
      # Desserts & Sweets
      {"name": "Ice Cream (vanilla)", "calories_per_100g": 207, "protein_per_100g": 3.5, "fat_per_100g": 11, "carbs_per_100g": 24, "fiber_per_100g": 0.7},
      {"name": "Ice Cream (chocolate)", "calories_per_100g": 216, "protein_per_100g": 3.8, "fat_per_100g": 11, "carbs_per_100g": 28, "fiber_per_100g": 1.6},
      {"name": "Frozen Yogurt", "calories_per_100g": 127, "protein_per_100g": 3.5, "fat_per_100g": 1.9, "carbs_per_100g": 25, "fiber_per_100g": 0},
      {"name": "Gelato", "calories_per_100g": 196, "protein_per_100g": 4.5, "fat_per_100g": 7.5, "carbs_per_100g": 28, "fiber_per_100g": 0.6},
      {"name": "Sherbet", "calories_per_100g": 138, "protein_per_100g": 1.1, "fat_per_100g": 1.9, "carbs_per_100g": 30, "fiber_per_100g": 0.4},
      {"name": "Pudding (chocolate)", "calories_per_100g": 99, "protein_per_100g": 2.8, "fat_per_100g": 3.3, "carbs_per_100g": 15, "fiber_per_100g": 0.8},
      {"name": "Jello", "calories_per_100g": 62, "protein_per_100g": 1.6, "fat_per_100g": 0, "carbs_per_100g": 14, "fiber_per_100g": 0},
      {"name": "Cheesecake", "calories_per_100g": 321, "protein_per_100g": 5.5, "fat_per_100g": 23, "carbs_per_100g": 26, "fiber_per_100g": 0.8},
      {"name": "Tiramisu", "calories_per_100g": 245, "protein_per_100g": 4.4, "fat_per_100g": 13, "carbs_per_100g": 28, "fiber_per_100g": 0.5},
      {"name": "Cake (chocolate)", "calories_per_100g": 371, "protein_per_100g": 5, "fat_per_100g": 16, "carbs_per_100g": 54, "fiber_per_100g": 2.2},
      {"name": "Cupcake", "calories_per_100g": 305, "protein_per_100g": 3.7, "fat_per_100g": 10, "carbs_per_100g": 51, "fiber_per_100g": 0.9},
      {"name": "Candy Bar (milk chocolate)", "calories_per_100g": 535, "protein_per_100g": 8, "fat_per_100g": 30, "carbs_per_100g": 60, "fiber_per_100g": 3.4},
      {"name": "Gummy Bears", "calories_per_100g": 325, "protein_per_100g": 6.9, "fat_per_100g": 0, "carbs_per_100g": 77, "fiber_per_100g": 0},
      {"name": "Jelly Beans", "calories_per_100g": 375, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 94, "fiber_per_100g": 0},
      {"name": "Marshmallow", "calories_per_100g": 318, "protein_per_100g": 1.8, "fat_per_100g": 0.2, "carbs_per_100g": 81, "fiber_per_100g": 0.1},
      {"name": "Caramel", "calories_per_100g": 382, "protein_per_100g": 5, "fat_per_100g": 8.1, "carbs_per_100g": 77, "fiber_per_100g": 0},
      
      # Beverages (per 100ml)
      {"name": "Orange Juice", "calories_per_100g": 45, "protein_per_100g": 0.7, "fat_per_100g": 0.2, "carbs_per_100g": 10, "fiber_per_100g": 0.2},
      {"name": "Apple Juice", "calories_per_100g": 46, "protein_per_100g": 0.1, "fat_per_100g": 0.1, "carbs_per_100g": 11, "fiber_per_100g": 0.2},
      {"name": "Cranberry Juice", "calories_per_100g": 46, "protein_per_100g": 0, "fat_per_100g": 0.1, "carbs_per_100g": 12, "fiber_per_100g": 0.1},
      {"name": "Grape Juice", "calories_per_100g": 60, "protein_per_100g": 0.4, "fat_per_100g": 0.2, "carbs_per_100g": 15, "fiber_per_100g": 0.2},
      {"name": "Pineapple Juice", "calories_per_100g": 53, "protein_per_100g": 0.4, "fat_per_100g": 0.2, "carbs_per_100g": 13, "fiber_per_100g": 0.2},
      {"name": "Tomato Juice", "calories_per_100g": 17, "protein_per_100g": 0.8, "fat_per_100g": 0.1, "carbs_per_100g": 4.2, "fiber_per_100g": 0.4},
      {"name": "Sports Drink", "calories_per_100g": 27, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 6.7, "fiber_per_100g": 0},
      {"name": "Energy Drink", "calories_per_100g": 45, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 11, "fiber_per_100g": 0},
      {"name": "Cola", "calories_per_100g": 41, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 11, "fiber_per_100g": 0},
      {"name": "Lemonade", "calories_per_100g": 40, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 11, "fiber_per_100g": 0},
      {"name": "Coffee (black)", "calories_per_100g": 1, "protein_per_100g": 0.1, "fat_per_100g": 0, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Coffee (with milk & sugar)", "calories_per_100g": 30, "protein_per_100g": 0.5, "fat_per_100g": 0.8, "carbs_per_100g": 5, "fiber_per_100g": 0},
      {"name": "Tea (black, unsweetened)", "calories_per_100g": 1, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 0.3, "fiber_per_100g": 0},
      {"name": "Green Tea", "calories_per_100g": 1, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Beer", "calories_per_100g": 43, "protein_per_100g": 0.5, "fat_per_100g": 0, "carbs_per_100g": 3.6, "fiber_per_100g": 0},
      {"name": "Red Wine", "calories_per_100g": 85, "protein_per_100g": 0.1, "fat_per_100g": 0, "carbs_per_100g": 2.6, "fiber_per_100g": 0},
      {"name": "White Wine", "calories_per_100g": 82, "protein_per_100g": 0.1, "fat_per_100g": 0, "carbs_per_100g": 2.6, "fiber_per_100g": 0},
      {"name": "Vodka (80 proof)", "calories_per_100g": 231, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 0, "fiber_per_100g": 0},
      {"name": "Whiskey", "calories_per_100g": 250, "protein_per_100g": 0, "fat_per_100g": 0, "carbs_per_100g": 0, "fiber_per_100g": 0},
      
      # Indian Foods
      {"name": "Roti (whole wheat)", "calories_per_100g": 264, "protein_per_100g": 9.2, "fat_per_100g": 4.2, "carbs_per_100g": 48, "fiber_per_100g": 6.8},
      {"name": "Paratha", "calories_per_100g": 321, "protein_per_100g": 6.5, "fat_per_100g": 14, "carbs_per_100g": 43, "fiber_per_100g": 3.2},
      {"name": "Poori", "calories_per_100g": 415, "protein_per_100g": 6.5, "fat_per_100g": 21, "carbs_per_100g": 52, "fiber_per_100g": 2.4},
      {"name": "Idli", "calories_per_100g": 106, "protein_per_100g": 2.8, "fat_per_100g": 0.3, "carbs_per_100g": 23, "fiber_per_100g": 0.8},
      {"name": "Dosa", "calories_per_100g": 168, "protein_per_100g": 3.9, "fat_per_100g": 3.7, "carbs_per_100g": 30, "fiber_per_100g": 1.4},
      {"name": "Samosa", "calories_per_100g": 262, "protein_per_100g": 4.7, "fat_per_100g": 13, "carbs_per_100g": 33, "fiber_per_100g": 3.2},
      {"name": "Pakora", "calories_per_100g": 298, "protein_per_100g": 6.5, "fat_per_100g": 18, "carbs_per_100g": 28, "fiber_per_100g": 3.5},
      {"name": "Dal (cooked)", "calories_per_100g": 104, "protein_per_100g": 7.5, "fat_per_100g": 0.4, "carbs_per_100g": 18, "fiber_per_100g": 7.2},
      {"name": "Rajma (kidney beans curry)", "calories_per_100g": 140, "protein_per_100g": 8.7, "fat_per_100g": 2.5, "carbs_per_100g": 22, "fiber_per_100g": 7.8},
      {"name": "Chole (chickpea curry)", "calories_per_100g": 168, "protein_per_100g": 8.9, "fat_per_100g": 3.8, "carbs_per_100g": 27, "fiber_per_100g": 7.6},
      {"name": "Biryani", "calories_per_100g": 160, "protein_per_100g": 4.2, "fat_per_100g": 5.5, "carbs_per_100g": 24, "fiber_per_100g": 1.2},
      {"name": "Pulao", "calories_per_100g": 130, "protein_per_100g": 2.8, "fat_per_100g": 3.5, "carbs_per_100g": 23, "fiber_per_100g": 0.9},
      {"name": "Khichdi", "calories_per_100g": 120, "protein_per_100g": 3.5, "fat_per_100g": 2.8, "carbs_per_100g": 21, "fiber_per_100g": 2.5},
      {"name": "Raita", "calories_per_100g": 54, "protein_per_100g": 2.5, "fat_per_100g": 2.3, "carbs_per_100g": 5.5, "fiber_per_100g": 0.4},
      {"name": "Lassi (sweet)", "calories_per_100g": 60, "protein_per_100g": 1.9, "fat_per_100g": 1.5, "carbs_per_100g": 10, "fiber_per_100g": 0},
      {"name": "Gulab Jamun", "calories_per_100g": 375, "protein_per_100g": 4.5, "fat_per_100g": 17, "carbs_per_100g": 52, "fiber_per_100g": 0.5},
      {"name": "Jalebi", "calories_per_100g": 416, "protein_per_100g": 1.6, "fat_per_100g": 18, "carbs_per_100g": 63, "fiber_per_100g": 0.2},
      {"name": "Ladoo", "calories_per_100g": 440, "protein_per_100g": 6.8, "fat_per_100g": 19, "carbs_per_100g": 62, "fiber_per_100g": 2.5},
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