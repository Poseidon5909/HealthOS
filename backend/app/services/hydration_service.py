from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from fastapi import HTTPException, status
from app.models.water_log import WaterLog
from app.models.daily_target import DailyTarget
from typing import Optional

class HydrationService:

    @staticmethod
    def log_water(db: Session, user_id: int, amount_ml: int):

        if amount_ml <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Water amount must be greater than zero"
            )
        
        if amount_ml > 5000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Single water log cannot exceed 5000 ml (5 liters)"
            )

        water_log = WaterLog(
            user_id=user_id,
            amount_ml=amount_ml,
            date=date.today()
        )

        db.add(water_log)
        db.commit()
        db.refresh(water_log)

        return water_log

    @staticmethod
    def get_daily_summary(db: Session, user_id: int, log_date: date):

        total_consumed = db.query(
            func.coalesce(func.sum(WaterLog.amount_ml), 0)
        ).filter(
            WaterLog.user_id == user_id,
            WaterLog.date == log_date
        ).scalar()

        target = db.query(DailyTarget).filter(
            DailyTarget.user_id == user_id
        ).first()

        water_target = target.water_target if target else 0

        remaining_ml = max(water_target - total_consumed, 0)

        progress_percentage = 0
        if water_target > 0:
            raw_progress = (total_consumed / water_target) * 100
            progress_percentage = min(raw_progress, 100)

        return {
            "water_target_ml": water_target,
            "total_consumed_ml": total_consumed,
            "remaining_ml": remaining_ml,
            "progress_percentage": round(progress_percentage, 2)
        }

    @staticmethod
    def get_by_id(db: Session, user_id: int, log_id: int):
        log = db.query(WaterLog).filter(
            WaterLog.id == log_id,
            WaterLog.user_id == user_id
        ).first()
        
        if not log:
            raise HTTPException(status_code=404, detail="Water log not found")
        
        return log

    @staticmethod
    def delete_log(db: Session, user_id: int, log_id: int):
        log = HydrationService.get_by_id(db, user_id, log_id)
        
        db.delete(log)
        db.commit()
        
        return {"message": "Water log deleted successfully"}

    @staticmethod
    def get_logs_history(db: Session, user_id: int,
                        start_date: Optional[date] = None,
                        end_date: Optional[date] = None,
                        skip: int = 0,
                        limit: int = 50):
        """Get water logs with optional date filtering and pagination."""
        query = db.query(WaterLog).filter(WaterLog.user_id == user_id)
        
        if start_date:
            query = query.filter(WaterLog.date >= start_date)
        if end_date:
            query = query.filter(WaterLog.date <= end_date)
        
        total = query.count()
        
        items = query.order_by(WaterLog.date.desc(), WaterLog.created_at.desc())\
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