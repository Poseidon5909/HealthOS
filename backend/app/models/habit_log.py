from sqlalchemy import Column, Integer, Boolean, String, ForeignKey, Date, DateTime, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    habit_type = Column(String, nullable=False)

    success = Column(Boolean, nullable=False)

    date = Column(Date, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="habit_logs")

    __table_args__ = (
        UniqueConstraint('user_id', 'habit_type', 'date', name='uq_habit_user_type_date'),
        Index("idx_habit_user_date", "user_id", "date"),
    )