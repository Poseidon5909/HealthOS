from sqlalchemy import Column, Integer, ForeignKey, Date, DateTime, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class WaterLog(Base):
    __tablename__ = "water_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount_ml = Column(Integer, nullable=False)

    date = Column(Date, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="water_logs")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'created_at', name='uq_water_user_time'),
        CheckConstraint('amount_ml > 0', name='check_amount_positive'),
        Index('idx_water_user_date', 'user_id', 'date'),
    )