from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.food_item import FoodItem
from app.schemas.food import FoodResponse, PortionRequest
from app.schemas.pagination import PaginatedResponse
from app.services.food_service import FoodService

router = APIRouter()


@router.get("/search", response_model=PaginatedResponse[FoodResponse])
def search_food(
    query: Optional[str] = Query(None, description="Search food by name"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of items to return"),
    db: Session = Depends(get_db)
):
    """
    Search for foods with pagination.
    
    - **query**: Search term to filter food items by name (case-insensitive)
    - **skip**: Pagination offset
    - **limit**: Max items per page (1-100)
    """
    return FoodService.search_foods(db, query, skip, limit)


@router.post("/{food_id}/calculate")
def calculate_portion(food_id: int, data: PortionRequest, db: Session = Depends(get_db)):
    """
    Calculate nutritional values for a specific portion size.
    
    - **food_id**: ID of the food item
    - **grams**: Portion size in grams
    """
    food = db.query(FoodItem).filter(FoodItem.id == food_id).first()

    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    return FoodService.calculate_portion(food, data.grams)


@router.get("/{food_id}/servings")
def get_food_serving_sizes(food_id: int, db: Session = Depends(get_db)):
    """
    Get all serving sizes for a specific food item.
    
    - **food_id**: ID of the food item
    """
    from app.models.serving_size import ServingSize
    
    food = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    servings = db.query(ServingSize).filter(ServingSize.food_id == food_id).all()
    
    return {
        "food_id": food_id,
        "food_name": food.name,
        "serving_sizes": servings
    }
