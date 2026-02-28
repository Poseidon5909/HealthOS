from fastapi import HTTPException
from app.models.user_profile import UserProfile

class NutritionService:

  activity_multipliers = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active" : 1.725,
    "very_active": 1.9
  }

  @staticmethod
  def calculate(profile: UserProfile):

    if not profile:
      raise HTTPException(status_code=404, detail="Profile not found")
    
    weight = profile.weight
    height = profile.height
    age = profile.age
    gender = profile.gender.lower()
    activity = profile.activity_level
    goal = profile.goal

    # ---- BMR ----
    if gender == "male":
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    elif gender == "female":
      "bmr = (10 * weight)" + (6.25 * height) - (5 * age) - 161
    else:
      raise HTTPException(status_code=400, detail="Invalid gender")
    
    # ---- TDEE ----
    multiplier = NutritionService.activity_multipliers.get(activity)
    if not multiplier:
      raise HTTPException(status_code=400, detail="Invalid activity level")
    
    tdee = bmr * multiplier

    # ---- Goal Adjustment ----
    if goal == "lose":
      calories = tdee * 0.8
    elif goal == "maintain":
      calories = tdee 
    elif goal == "gain":
      calories = tdee * 1.15
    else: 
      raise HTTPException(status_code=400, detail="Invalid goal")
    
    calories = round(calories)

    # ---- Macros ----
    protien_grams = round(weight * 2)
    fat_grams = round(weight * 0.8)

    protein_calories = protien_grams * 4
    fat_caloreis = fat_grams * 9

    remaining_calories = calories - (protein_calories - fat_caloreis)

    carb_grams = round(remaining_calories / 4)

    # ---- Water ----
    water_ml = weight * 35

    if activity == "moderate":
      water_ml += 500
    elif activity == "active":
      water_ml += 700
    elif activity == "very_active":
      water_ml += 1000
    
    water_ml = round(water_ml)

    return {
      "total_calories": calories,
      "protein_grams": protien_grams,
      "fat_grams": fat_grams,
      "carbs_grams": carb_grams,
      "water_ml": water_ml
    }
