from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.food_log import FoodLog
from app.models.food_item import FoodItem
from app.models.serving_size import ServingSize
from app.models.daily_target import DailyTarget
from typing import Optional


class FoodLogService:

    @staticmethod
    def log_food(db: Session, user_id: int, food_id: int, quantity_grams: Optional[float] = None, 
                 serving_size_id: Optional[int] = None, serving_quantity: Optional[float] = None,
                 meal_type: Optional[str] = None):

        food = db.query(FoodItem).filter(FoodItem.id == food_id).first()

        if not food:
            raise HTTPException(status_code=404, detail="Food not found")
        
        # Calculate grams based on input method
        if serving_size_id and serving_quantity:
            # Using serving size method
            serving = db.query(ServingSize).filter(
                ServingSize.id == serving_size_id,
                ServingSize.food_id == food_id
            ).first()
            
            if not serving:
                raise HTTPException(status_code=404, detail="Serving size not found for this food item")
            
            # Convert serving to grams
            quantity_grams = serving.grams_per_serving * serving_quantity
        
        elif quantity_grams is None:
            raise HTTPException(status_code=400, detail="Must provide either quantity_grams OR serving size")
        
        # Validate quantity
        if quantity_grams < 0.1:
            raise HTTPException(status_code=400, detail="Quantity must be at least 0.1 gram")
        if quantity_grams > 5000:
            raise HTTPException(status_code=400, detail="Quantity cannot exceed 5000 grams (5 kg)")

        factor = quantity_grams / 100

        calories = food.calories_per_100g * factor
        protein = food.protein_per_100g * factor
        fat = food.fat_per_100g * factor
        carbs = food.carbs_per_100g * factor
        
        # Validate calculated calories are reasonable
        if calories > 10000:
            raise HTTPException(status_code=400, detail="Calculated calories exceed reasonable limit (10,000 per entry)")

        log = FoodLog(
            user_id=user_id,
            food_id=food_id,
            quantity_grams=round(quantity_grams, 2),
            meal_type=meal_type,
            calculated_calories=round(calories, 2),
            calculated_protein=round(protein, 2),
            calculated_fat=round(fat, 2),
            calculated_carbs=round(carbs, 2),
            date=date.today()
        )

        db.add(log)
        db.commit()
        db.refresh(log)

        return log

    @staticmethod
    def get_daily_logs(db: Session, user_id: int, target_date: date):
        return db.query(FoodLog).filter(
            FoodLog.user_id == user_id,
            FoodLog.date == target_date
        ).all()

    @staticmethod
    def get_daily_summary(db: Session, user_id: int, target_date: date):

        totals = db.query(
            func.sum(FoodLog.calculated_calories),
            func.sum(FoodLog.calculated_protein),
            func.sum(FoodLog.calculated_fat),
            func.sum(FoodLog.calculated_carbs)
        ).filter(
            FoodLog.user_id == user_id,
            FoodLog.date == target_date
        ).first()

        daily_target = db.query(DailyTarget).filter(
            DailyTarget.user_id == user_id,
            DailyTarget.date == target_date
        ).first()

        if not daily_target:
            raise HTTPException(status_code=404, detail="Daily target not found")

        consumed = {
            "calories": totals[0] or 0,
            "protein": totals[1] or 0,
            "fat": totals[2] or 0,
            "carbs": totals[3] or 0
        }

        remaining = {
            "calories": daily_target.calorie_target - consumed["calories"],
            "protein": daily_target.protein_target - consumed["protein"],
            "fat": daily_target.fat_target - consumed["fat"],
            "carbs": daily_target.carb_target - consumed["carbs"]
        }

        return {
            "consumed": consumed,
            "remaining": remaining,
            "target": {
                "calories": daily_target.calorie_target,
                "protein": daily_target.protein_target,
                "fat": daily_target.fat_target,
                "carbs": daily_target.carb_target
            }
        }

    @staticmethod
    def get_by_id(db: Session, user_id: int, log_id: int):
        log = db.query(FoodLog).filter(
            FoodLog.id == log_id,
            FoodLog.user_id == user_id
        ).first()
        
        if not log:
            raise HTTPException(status_code=404, detail="Food log not found")
        
        return log

    @staticmethod
    def update_log(db: Session, user_id: int, log_id: int, food_id: int = None, quantity: float = None, meal_type: str = None):
        log = FoodLogService.get_by_id(db, user_id, log_id)
        
        if food_id is not None:
            food = db.query(FoodItem).filter(FoodItem.id == food_id).first()
            if not food:
                raise HTTPException(status_code=404, detail="Food not found")
            log.food_id = food_id
        
        if quantity is not None:
            log.quantity_grams = quantity
        
        if meal_type is not None:
            log.meal_type = meal_type
        
        food = db.query(FoodItem).filter(FoodItem.id == log.food_id).first()
        factor = log.quantity_grams / 100
        
        log.calculated_calories = round(food.calories_per_100g * factor, 2)
        log.calculated_protein = round(food.protein_per_100g * factor, 2)
        log.calculated_fat = round(food.fat_per_100g * factor, 2)
        log.calculated_carbs = round(food.carbs_per_100g * factor, 2)
        
        db.commit()
        db.refresh(log)
        
        return log

    @staticmethod
    def delete_log(db: Session, user_id: int, log_id: int):
        log = FoodLogService.get_by_id(db, user_id, log_id)
        
        db.delete(log)
        db.commit()
        
        return {"message": "Food log deleted successfully"}

    @staticmethod
    def get_logs_history(db: Session, user_id: int, 
                        start_date: Optional[date] = None, 
                        end_date: Optional[date] = None,
                        skip: int = 0, 
                        limit: int = 50):
        """Get food logs with optional date filtering and pagination."""
        query = db.query(FoodLog).filter(FoodLog.user_id == user_id)
        
        if start_date:
            query = query.filter(FoodLog.date >= start_date)
        if end_date:
            query = query.filter(FoodLog.date <= end_date)
        
        total = query.count()
        
        items = query.order_by(FoodLog.date.desc(), FoodLog.created_at.desc())\
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