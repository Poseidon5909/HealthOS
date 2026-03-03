from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.models.water_log import WaterLog
from app.models.daily_target import DailyTarget

class HydrationService:

    @staticmethod
    def log_water(db: Session, user_id: int, amount_ml: int):

        if amount_ml <= 0:
            raise Exception("Water amount must be greater than zero")

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