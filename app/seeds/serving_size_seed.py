from sqlalchemy.orm import Session
from app.models.serving_size import ServingSize
from app.models.food_item import FoodItem

def seed_serving_sizes(db: Session):
    """Seed common serving sizes for food items."""
    
    # Check if serving sizes already exist
    if db.query(ServingSize).first():
        return
    
    # Serving size mappings: food_name -> [(serving_name, grams_per_serving), ...]
    serving_mappings = {
        # Grains & Cereals
        "Rice (white, cooked)": [("1 cup", 158), ("1/2 cup", 79), ("1 bowl", 200)],
        "Rice (brown, cooked)": [("1 cup", 195), ("1/2 cup", 97.5), ("1 bowl", 200)],
        "Oats": [("1 cup dry", 90), ("1/2 cup dry", 45), ("1 tablespoon", 6)],
        "Quinoa (cooked)": [("1 cup", 185), ("1/2 cup", 92.5)],
        "Whole Wheat Bread": [("1 slice", 28), ("2 slices", 56)],
        "White Bread": [("1 slice", 25), ("2 slices", 50)],
        "Pasta (cooked)": [("1 cup", 140), ("1/2 cup", 70), ("1 plate", 200)],
        "Couscous (cooked)": [("1 cup", 157), ("1/2 cup", 78.5)],
        
        # Proteins - Meat & Poultry
        "Chicken Breast": [("1 piece (small)", 100), ("1 piece (medium)", 150), ("1 piece (large)", 200)],
        "Chicken Thigh": [("1 piece", 90), ("2 pieces", 180)],
        "Turkey": [("1 slice", 28), ("3 slices", 84), ("100g", 100)],
        "Beef (lean)": [("1 small steak", 100), ("1 medium steak", 150), ("1 large steak", 200)],
        "Pork Chop": [("1 piece", 120), ("1 large piece", 180)],
        
        # Proteins - Seafood
        "Salmon": [("1 fillet (small)", 100), ("1 fillet (medium)", 150), ("1 fillet (large)", 200)],
        "Tuna": [("1 can", 100), ("1 fillet", 150)],
        "Shrimp": [("5 pieces", 50), ("10 pieces", 100), ("1 serving", 85)],
        
        # Proteins - Eggs & Dairy
        "Egg (whole)": [("1 egg", 50), ("2 eggs", 100), ("3 eggs", 150)],
        "Egg White": [("1 egg white", 33), ("2 egg whites", 66)],
        "Milk (whole)": [("1 cup", 244), ("1/2 cup", 122), ("1 glass", 250)],
        "Milk (skim)": [("1 cup", 244), ("1/2 cup", 122), ("1 glass", 250)],
        "Greek Yogurt": [("1 cup", 245), ("1/2 cup", 122.5), ("1 container", 170)],
        "Cheddar Cheese": [("1 slice", 28), ("1 oz", 28), ("1 cup shredded", 113)],
        "Cottage Cheese": [("1 cup", 226), ("1/2 cup", 113)],
        "Paneer": [("1 piece (cube)", 30), ("1 cup cubed", 150)],
        
        # Proteins - Plant-based
        "Tofu": [("1/2 cup", 126), ("1 block", 340)],
        "Tempeh": [("1 cup", 166), ("1/2 cup", 83)],
        "Lentils (cooked)": [("1 cup", 198), ("1/2 cup", 99), ("1 tablespoon", 16)],
        "Chickpeas (cooked)": [("1 cup", 164), ("1/2 cup", 82)],
        "Black Beans (cooked)": [("1 cup", 172), ("1/2 cup", 86)],
        "Kidney Beans (cooked)": [("1 cup", 177), ("1/2 cup", 88.5)],
        
        # Vegetables
        "Broccoli": [("1 cup chopped", 91), ("1/2 cup", 45.5), ("1 piece", 30)],
        "Spinach": [("1 cup raw", 30), ("1 cup cooked", 180), ("1 handful", 20)],
        "Kale": [("1 cup chopped", 67), ("1/2 cup", 33.5)],
        "Carrot": [("1 medium", 61), ("1 large", 72), ("1 cup chopped", 128)],
        "Tomato": [("1 medium", 123), ("1 small", 91), ("1 cup chopped", 180)],
        "Bell Pepper": [("1 medium", 119), ("1 cup chopped", 149)],
        "Cucumber": [("1 medium", 301), ("1 cup sliced", 104)],
        "Cauliflower": [("1 cup chopped", 107), ("1/2 cup", 53.5)],
        "Sweet Potato": [("1 medium", 114), ("1 large", 180), ("1 cup cubed", 133)],
        "Potato (baked)": [("1 medium", 173), ("1 large", 299)],
        "Onion": [("1 medium", 110), ("1 cup chopped", 160)],
        "Mushroom": [("1 cup sliced", 70), ("1 piece", 18)],
        
        # Fruits
        "Apple": [("1 medium", 182), ("1 small", 149), ("1 large", 223)],
        "Banana": [("1 medium", 118), ("1 small", 101), ("1 large", 136)],
        "Orange": [("1 medium", 131), ("1 small", 96), ("1 large", 184)],
        "Mango": [("1 cup sliced", 165), ("1 medium", 336)],
        "Pineapple": [("1 cup chunks", 165), ("1 slice", 84)],
        "Strawberry": [("1 cup", 152), ("1 medium", 12), ("5 pieces", 60)],
        "Blueberry": [("1 cup", 148), ("1/2 cup", 74)],
        "Watermelon": [("1 cup diced", 152), ("1 wedge", 286)],
        "Grapes": [("1 cup", 92), ("10 grapes", 49)],
        "Avocado": [("1/2 avocado", 100), ("1 avocado", 200)],
        "Papaya": [("1 cup cubed", 145), ("1 small", 157)],
        "Pomegranate": [("1/2 cup seeds", 87), ("1 medium", 282)],
        
        # Nuts & Seeds
        "Almonds": [("1 oz (23 nuts)", 28), ("1/4 cup", 36), ("1 tablespoon", 9)],
        "Walnuts": [("1 oz (14 halves)", 28), ("1/4 cup", 30), ("1 tablespoon", 8)],
        "Cashews": [("1 oz (18 nuts)", 28), ("1/4 cup", 34)],
        "Peanuts": [("1 oz", 28), ("1/4 cup", 37), ("1 tablespoon", 9)],
        "Peanut Butter": [("1 tablespoon", 16), ("2 tablespoons", 32), ("1 teaspoon", 5.3)],
        "Chia Seeds": [("1 tablespoon", 12), ("1 teaspoon", 4), ("1 oz", 28)],
        "Flax Seeds": [("1 tablespoon", 10), ("1 teaspoon", 3.3)],
        "Sunflower Seeds": [("1 oz", 28), ("1/4 cup", 35), ("1 tablespoon", 9)],
        
        # Fats & Oils
        "Olive Oil": [("1 tablespoon", 14), ("1 teaspoon", 4.7), ("1/4 cup", 54)],
        "Coconut Oil": [("1 tablespoon", 14), ("1 teaspoon", 4.7)],
        "Butter": [("1 tablespoon", 14), ("1 teaspoon", 4.7), ("1 pat", 5)],
        "Ghee": [("1 tablespoon", 14), ("1 teaspoon", 4.7)],
        
        # Snacks & Others
        "Dark Chocolate (70-85%)": [("1 oz", 28), ("1 square", 10), ("1 bar", 100)],
        "Honey": [("1 tablespoon", 21), ("1 teaspoon", 7)],
        "Hummus": [("2 tablespoons", 30), ("1/4 cup", 62), ("1 tablespoon", 15)],
        "Popcorn (air-popped)": [("1 cup", 8), ("3 cups", 24), ("1 bowl", 50)],
    }
    
    # Get all food items
    foods = db.query(FoodItem).all()
    food_dict = {food.name: food.id for food in foods}
    
    serving_sizes = []
    for food_name, servings in serving_mappings.items():
        if food_name in food_dict:
            food_id = food_dict[food_name]
            for serving_name, grams in servings:
                serving_sizes.append(ServingSize(
                    food_id=food_id,
                    serving_name=serving_name,
                    grams_per_serving=grams
                ))
    
    # Bulk insert all serving sizes
    db.bulk_save_objects(serving_sizes)
    db.commit()
    
    print(f"Seeded {len(serving_sizes)} serving sizes for {len(serving_mappings)} food items")
