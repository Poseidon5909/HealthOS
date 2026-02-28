from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class DailyTarget(Base):
  __tablename__ = "daily_targets"

  id = Column(Integer, primary_key=True, index=True)

  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  date = Column(Date, nullable=False)

  calorie_target = Column(Integer, nullable=False)
  protein_target = Column(Integer, nullable=False)
  fat_target = Column(Integer, nullable=False)
  carb_target = Column(Integer, nullable=False)
  water_target = Column(Integer, nullable=False)

  created_at = Column(DateTime(timezone=True), server_default=func.now())
  
  user = relationship("User", backref="daily_targets")

  __table_args__ = (
      UniqueConstraint("user_id", "date", name="unique_user_date"),
  )

