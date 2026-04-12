from sqlalchemy.orm import Session
from app.models.exercise import Exercise

def seed_exercises(db: Session):
    # Check if exercises already exist
    if db.query(Exercise).first():
        return
    
    exercises = [
        # Cardio - Running & Walking
        {"name": "Walking (slow, 2-3 mph)", "met_value": 2.5, "category": "cardio"},
        {"name": "Walking (moderate, 3-4 mph)", "met_value": 3.5, "category": "cardio"},
        {"name": "Walking (brisk, 4-5 mph)", "met_value": 5.0, "category": "cardio"},
        {"name": "Jogging", "met_value": 7.0, "category": "cardio"},
        {"name": "Running (5 mph)", "met_value": 8.0, "category": "cardio"},
        {"name": "Running (6 mph)", "met_value": 10.0, "category": "cardio"},
        {"name": "Running (7 mph)", "met_value": 11.5, "category": "cardio"},
        {"name": "Running (8+ mph)", "met_value": 13.5, "category": "cardio"},
        {"name": "Sprint Training", "met_value": 15.0, "category": "cardio"},
        {"name": "Treadmill", "met_value": 7.0, "category": "cardio"},
        {"name": "Stair Climbing", "met_value": 9.0, "category": "cardio"},
        {"name": "Hiking", "met_value": 6.0, "category": "cardio"},
        
        # Cardio - Cycling
        {"name": "Cycling (leisure, <10 mph)", "met_value": 4.0, "category": "cardio"},
        {"name": "Cycling (moderate, 10-12 mph)", "met_value": 6.0, "category": "cardio"},
        {"name": "Cycling (vigorous, 12-14 mph)", "met_value": 8.0, "category": "cardio"},
        {"name": "Cycling (racing, 14-16 mph)", "met_value": 10.0, "category": "cardio"},
        {"name": "Cycling (very fast, 16+ mph)", "met_value": 12.0, "category": "cardio"},
        {"name": "Stationary Bike (moderate)", "met_value": 6.8, "category": "cardio"},
        {"name": "Stationary Bike (vigorous)", "met_value": 10.5, "category": "cardio"},
        {"name": "Spin Class", "met_value": 8.5, "category": "cardio"},
        {"name": "Mountain Biking", "met_value": 8.5, "category": "cardio"},
        
        # Cardio - Swimming & Water Sports
        {"name": "Swimming (leisure)", "met_value": 6.0, "category": "cardio"},
        {"name": "Swimming (freestyle, moderate)", "met_value": 8.0, "category": "cardio"},
        {"name": "Swimming (freestyle, vigorous)", "met_value": 10.0, "category": "cardio"},
        {"name": "Swimming (backstroke)", "met_value": 7.0, "category": "cardio"},
        {"name": "Swimming (breaststroke)", "met_value": 10.0, "category": "cardio"},
        {"name": "Swimming (butterfly)", "met_value": 13.8, "category": "cardio"},
        {"name": "Water Aerobics", "met_value": 5.5, "category": "cardio"},
        {"name": "Water Jogging", "met_value": 8.0, "category": "cardio"},
        
        # Cardio - Other
        {"name": "Jump Rope (moderate)", "met_value": 10.0, "category": "cardio"},
        {"name": "Jump Rope (vigorous)", "met_value": 12.0, "category": "cardio"},
        {"name": "Rowing Machine (moderate)", "met_value": 7.0, "category": "cardio"},
        {"name": "Rowing Machine (vigorous)", "met_value": 12.0, "category": "cardio"},
        {"name": "Elliptical Trainer", "met_value": 5.0, "category": "cardio"},
        {"name": "Elliptical (vigorous)", "met_value": 8.0, "category": "cardio"},
        {"name": "Aerobics (low impact)", "met_value": 5.0, "category": "cardio"},
        {"name": "Aerobics (high impact)", "met_value": 7.0, "category": "cardio"},
        {"name": "Step Aerobics", "met_value": 8.5, "category": "cardio"},
        {"name": "Zumba", "met_value": 7.3, "category": "cardio"},
        {"name": "Dance (moderate)", "met_value": 4.5, "category": "cardio"},
        {"name": "Dance (vigorous)", "met_value": 6.5, "category": "cardio"},
        {"name": "HIIT", "met_value": 10.0, "category": "cardio"},
        {"name": "CrossFit", "met_value": 10.0, "category": "cardio"},
        {"name": "Burpees", "met_value": 8.0, "category": "cardio"},
        
        # Strength Training - Bodyweight
        {"name": "Push-ups", "met_value": 8.0, "category": "strength"},
        {"name": "Pull-ups", "met_value": 8.0, "category": "strength"},
        {"name": "Squats (bodyweight)", "met_value": 5.0, "category": "strength"},
        {"name": "Lunges", "met_value": 6.0, "category": "strength"},
        {"name": "Dips", "met_value": 5.0, "category": "strength"},
        {"name": "Burpees", "met_value": 8.0, "category": "strength"},
        {"name": "Mountain Climbers", "met_value": 8.0, "category": "strength"},
        
        # Strength Training - Weights
        {"name": "Weight Lifting (light)", "met_value": 3.0, "category": "strength"},
        {"name": "Weight Lifting (moderate)", "met_value": 5.0, "category": "strength"},
        {"name": "Weight Lifting (vigorous)", "met_value": 6.0, "category": "strength"},
        {"name": "Bench Press", "met_value": 5.0, "category": "strength"},
        {"name": "Deadlifts", "met_value": 6.0, "category": "strength"},
        {"name": "Squats (weighted)", "met_value": 6.0, "category": "strength"},
        {"name": "Leg Press", "met_value": 6.0, "category": "strength"},
        {"name": "Bicep Curls", "met_value": 4.0, "category": "strength"},
        {"name": "Shoulder Press", "met_value": 5.0, "category": "strength"},
        {"name": "Kettlebell", "met_value": 8.0, "category": "strength"},
        {"name": "Resistance Training", "met_value": 5.0, "category": "strength"},
        
        # Core & Flexibility
        {"name": "Plank", "met_value": 3.0, "category": "core"},
        {"name": "Crunches", "met_value": 3.8, "category": "core"},
        {"name": "Sit-ups", "met_value": 4.0, "category": "core"},
        {"name": "Russian Twists", "met_value": 3.5, "category": "core"},
        {"name": "Leg Raises", "met_value": 4.0, "category": "core"},
        {"name": "Yoga (Hatha)", "met_value": 2.5, "category": "flexibility"},
        {"name": "Yoga (Vinyasa/Power)", "met_value": 4.0, "category": "flexibility"},
        {"name": "Yoga (Ashtanga)", "met_value": 4.0, "category": "flexibility"},
        {"name": "Pilates", "met_value": 3.0, "category": "flexibility"},
        {"name": "Stretching (light)", "met_value": 2.3, "category": "flexibility"},
        {"name": "Tai Chi", "met_value": 3.0, "category": "flexibility"},
        
        # Sports
        {"name": "Basketball", "met_value": 8.0, "category": "sports"},
        {"name": "Soccer", "met_value": 10.0, "category": "sports"},
        {"name": "Tennis (singles)", "met_value": 8.0, "category": "sports"},
        {"name": "Tennis (doubles)", "met_value": 6.0, "category": "sports"},
        {"name": "Badminton", "met_value": 5.5, "category": "sports"},
        {"name": "Table Tennis", "met_value": 4.0, "category": "sports"},
        {"name": "Volleyball", "met_value": 4.0, "category": "sports"},
        {"name": "Cricket", "met_value": 5.0, "category": "sports"},
        {"name": "Golf (walking)", "met_value": 4.8, "category": "sports"},
        {"name": "Golf (cart)", "met_value": 3.5, "category": "sports"},
        {"name": "Bowling", "met_value": 3.0, "category": "sports"},
        {"name": "Boxing (sparring)", "met_value": 9.0, "category": "sports"},
        {"name": "Boxing (heavy bag)", "met_value": 6.0, "category": "sports"},
        {"name": "Martial Arts", "met_value": 10.0, "category": "sports"},
        {"name": "Rock Climbing", "met_value": 11.0, "category": "sports"},
        {"name": "Ice Skating", "met_value": 7.0, "category": "sports"},
        {"name": "Skiing (downhill)", "met_value": 6.0, "category": "sports"},
        {"name": "Skiing (cross-country)", "met_value": 9.0, "category": "sports"},
        {"name": "Snowboarding", "met_value": 6.0, "category": "sports"},
        {"name": "Surfing", "met_value": 3.0, "category": "sports"},
        {"name": "Kayaking", "met_value": 5.0, "category": "sports"},
        
        # Daily Activities
        {"name": "Gardening", "met_value": 4.0, "category": "daily"},
        {"name": "Mowing Lawn", "met_value": 5.5, "category": "daily"},
        {"name": "Housework (general)", "met_value": 3.0, "category": "daily"},
        {"name": "Housework (vigorous)", "met_value": 4.0, "category": "daily"},
        {"name": "Yard Work", "met_value": 5.0, "category": "daily"},
        {"name": "Snow Shoveling", "met_value": 6.0, "category": "daily"},
        {"name": "Moving Furniture", "met_value": 6.0, "category": "daily"},
        {"name": "Playing with Kids", "met_value": 4.0, "category": "daily"},
    ]
    
    for exercise_data in exercises:
        exercise = Exercise(**exercise_data)
        db.add(exercise)
    
    db.commit()