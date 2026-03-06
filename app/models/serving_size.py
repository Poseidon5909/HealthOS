from sqlalchemy import Column, Integer, Float, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class ServingSize(Base):
    __tablename__ = "serving_sizes"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)
    
    # Serving description (e.g., "1 slice", "1 tablespoon", "1 cup", "1 piece")
    serving_name = Column(String(100), nullable=False)
    
    # Grams per serving (e.g., 1 slice of bread = 30g)
    grams_per_serving = Column(Float, nullable=False)
    
    # Relationships
    food_item = relationship("FoodItem", back_populates="serving_sizes")
    
    __table_args__ = (
        CheckConstraint('grams_per_serving > 0', name='check_serving_grams_positive'),
    )
