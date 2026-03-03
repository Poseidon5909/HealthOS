from sqlalchemy.orm import Session
from app.models.exercise import Exercise

def seed_exercises(db: Session):
    # Check if exercises already exist
    if db.query(Exercise).first():
        return
    
    exercises = [
        {"name": "Walking", "met_value": 3.5, "category": "cardio"},
        {"name": "Running", "met_value": 8.0, "category": "cardio"},
        {"name": "Cycling", "met_value": 8.5, "category": "cardio"},
        {"name": "Jump Rope", "met_value": 12.0, "category": "cardio"},
        {"name": "Swimming", "met_value": 6.0, "category": "cardio"},
        {"name": "Push-ups", "met_value": 8.0, "category": "strength"},
        {"name": "Squats", "met_value": 5.0, "category": "strength"},
        {"name": "Deadlifts", "met_value": 6.0, "category": "strength"},
        {"name": "Bench Press", "met_value": 5.0, "category": "strength"},
        {"name": "Yoga", "met_value": 2.5, "category": "flexibility"},
        {"name": "HIIT", "met_value": 10.0, "category": "cardio"},
        {"name": "Stair Climbing", "met_value": 9.0, "category": "cardio"},
        {"name": "Plank", "met_value": 3.0, "category": "core"},
        {"name": "Rowing", "met_value": 7.0, "category": "cardio"},
        {"name": "Elliptical", "met_value": 5.0, "category": "cardio"},
    ]
    
    for exercise_data in exercises:
        exercise = Exercise(**exercise_data)
        db.add(exercise)
    
    db.commit()