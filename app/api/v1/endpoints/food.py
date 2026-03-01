from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.food_item import FoodItem
from app.schemas.food import FoodResponse, PortionRequest
from app.services.food_service import FoodService

router = APIRouter()


@router.get("/search", response_model=list[FoodResponse])
def search_food(query: str = Query(...), db: Session = Depends(get_db)):
    return db.query(FoodItem).filter(
        FoodItem.name.ilike(f"%{query}%")
    ).all()


@router.post("/{food_id}/calculate")
def calculate_portion(food_id: int, data: PortionRequest, db: Session = Depends(get_db)):
    food = db.query(FoodItem).filter(FoodItem.id == food_id).first()

    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    return FoodService.calculate_portion(food, data.grams)
