from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.food_log import FoodLogCreate, FoodLogUpdate, FoodLogResponse
from app.schemas.pagination import PaginatedResponse
from app.services.food_log_service import FoodLogService

router = APIRouter()

@router.post("/", response_model=FoodLogResponse)
def log_food(
  data: FoodLogCreate,
  db: Session = Depends(get_db),
  current_user = Depends(get_current_user)
):
    """
    Log a food entry for the current user.
    
    **Two ways to log food:**
    
    **Option 1: By weight (grams)**
    ```json
    {
      "food_id": 1,
      "quantity_grams": 100,
      "meal_type": "breakfast"
    }
    ```
    
    **Option 2: By serving size (more user-friendly)**
    ```json
    {
      "food_id": 1,
      "serving_size_id": 5,
      "serving_quantity": 2,
      "meal_type": "lunch"
    }
    ```
    
    **Meal Types (optional):**
    - breakfast
    - lunch
    - dinner
    - snack
    
    **Example:** Log 2 slices of bread for breakfast
    - First, get serving sizes: GET /api/v1/food/{food_id}/servings
    - Find the serving_size_id for "1 slice"
    - Then log: {"food_id": 5, "serving_size_id": 12, "serving_quantity": 2, "meal_type": "breakfast"}
    
    **Note:** You must use EITHER quantity_grams OR (serving_size_id + serving_quantity), not both.
    """
    return FoodLogService.log_food(
        db,
        current_user.id,
        data.food_id,
        quantity_grams=data.quantity_grams,
        serving_size_id=data.serving_size_id,
        serving_quantity=data.serving_quantity,
        meal_type=data.meal_type
    )

@router.get("/history", response_model=PaginatedResponse[FoodLogResponse])
def get_food_history(
    start_date: Optional[date] = Query(None, description="Filter from this date"),
    end_date: Optional[date] = Query(None, description="Filter until this date"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get food log history with optional date filtering and pagination.
    
    - **start_date**: Filter logs from this date onwards
    - **end_date**: Filter logs until this date
    - **skip**: Pagination offset
    - **limit**: Max items per page (1-100)
    """
    return FoodLogService.get_logs_history(
        db, current_user.id, start_date, end_date, skip, limit
    )

@router.get("/today")
def get_today_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get today's food log summary with nutrition totals."""
    return FoodLogService.get_daily_summary(
        db,
        current_user.id,
        date.today()
    )

@router.get("/{log_id}", response_model=FoodLogResponse)
def get_food_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return FoodLogService.get_by_id(db, current_user.id, log_id)

@router.put("/{log_id}", response_model=FoodLogResponse)
def update_food_log(
    log_id: int,
    data: FoodLogUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a food log entry (food item, quantity, or meal type)."""
    return FoodLogService.update_log(
        db,
        current_user.id,
        log_id,
        data.food_id,
        data.quantity_grams,
        data.meal_type
    )

@router.delete("/{log_id}")
def delete_food_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return FoodLogService.delete_log(db, current_user.id, log_id)


@router.get("/meals/{meal_type}", response_model=PaginatedResponse[FoodLogResponse])
def get_logs_by_meal(
    meal_type: str,
    target_date: Optional[date] = Query(None, description="Date to filter (default: today)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get food logs for a specific meal type.
    
    - **meal_type**: breakfast, lunch, dinner, or snack
    - **target_date**: Date to filter (defaults to today)
    - **skip**: Pagination offset
    - **limit**: Max items per page
    """
    from app.models.food_log import FoodLog
    
    # Validate meal type
    valid_meals = ["breakfast", "lunch", "dinner", "snack"]
    if meal_type.lower() not in valid_meals:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid meal type. Must be one of: {', '.join(valid_meals)}"
        )
    
    if not target_date:
        target_date = date.today()
    
    query = db.query(FoodLog).filter(
        FoodLog.user_id == current_user.id,
        FoodLog.meal_type == meal_type.lower(),
        FoodLog.date == target_date
    )
    
    total = query.count()
    items = query.order_by(FoodLog.created_at.desc())\
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


@router.get("/meals/summary/today")
def get_meals_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get nutrition summary broken down by meal type for today.
    
    Returns total calories, protein, fat, carbs for each meal (breakfast, lunch, dinner, snacks).
    """
    from app.models.food_log import FoodLog
    from sqlalchemy import func
    
    today = date.today()
    
    # Get logs grouped by meal type
    meals_data = db.query(
        FoodLog.meal_type,
        func.sum(FoodLog.calculated_calories).label('calories'),
        func.sum(FoodLog.calculated_protein).label('protein'),
        func.sum(FoodLog.calculated_fat).label('fat'),
        func.sum(FoodLog.calculated_carbs).label('carbs'),
        func.count(FoodLog.id).label('items_count')
    ).filter(
        FoodLog.user_id == current_user.id,
        FoodLog.date == today
    ).group_by(FoodLog.meal_type).all()
    
    # Format results
    meals_summary = {}
    total_calories = 0
    total_protein = 0
    total_fat = 0
    total_carbs = 0
    
    for meal in meals_data:
        meal_name = meal.meal_type or "uncategorized"
        meals_summary[meal_name] = {
            "calories": round(meal.calories or 0, 2),
            "protein": round(meal.protein or 0, 2),
            "fat": round(meal.fat or 0, 2),
            "carbs": round(meal.carbs or 0, 2),
            "items_count": meal.items_count
        }
        total_calories += meal.calories or 0
        total_protein += meal.protein or 0
        total_fat += meal.fat or 0
        total_carbs += meal.carbs or 0
    
    return {
        "date": today,
        "meals": meals_summary,
        "daily_totals": {
            "calories": round(total_calories, 2),
            "protein": round(total_protein, 2),
            "fat": round(total_fat, 2),
            "carbs": round(total_carbs, 2)
        }
    }
