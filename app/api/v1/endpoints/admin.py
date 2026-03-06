from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.food_item import FoodItem
from app.models.serving_size import ServingSize
from app.models.exercise import Exercise
from app.services.food_service import FoodService
from app.seeds.exercise_seed import seed_exercises
from app.seeds.serving_size_seed import seed_serving_sizes

router = APIRouter()


@router.post("/reseed-database")
def reseed_database(db: Session = Depends(get_db)):
    """
    ⚠️ ADMIN ONLY: Clear and reseed all food, exercise, and serving size data.
    
    This will:
    1. Delete all existing serving sizes
    2. Delete all existing food items
    3. Delete all existing exercises
    4. Re-seed with latest data (80+ foods, 110+ exercises, 200+ serving sizes)
    
    Note: This does NOT delete user data (accounts, food logs, etc.)
    """
    
    try:
        # Step 1: Delete existing data
        db.query(ServingSize).delete()
        db.query(FoodItem).delete()
        db.query(Exercise).delete()
        db.commit()
        
        # Step 2: Re-seed data
        FoodService.seed_initial_data(db)
        seed_exercises(db)
        seed_serving_sizes(db)
        
        # Count results
        food_count = db.query(FoodItem).count()
        exercise_count = db.query(Exercise).count()
        serving_count = db.query(ServingSize).count()
        
        return {
            "success": True,
            "message": "Database reseeded successfully",
            "data": {
                "foods_seeded": food_count,
                "exercises_seeded": exercise_count,
                "serving_sizes_seeded": serving_count
            }
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reseed database: {str(e)}")
