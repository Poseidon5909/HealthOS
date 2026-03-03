from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Exercise(Base):
  __tablename__ = "excercises"

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)
  met_value = Column(Float, nullable=False)
  category = Column(String, nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())