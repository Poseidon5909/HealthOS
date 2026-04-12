from pydantic import BaseModel
from datetime import datetime

class ExerciseResponse(BaseModel):
    id: int
    name: str
    met_value: float
    category: str
    created_at: datetime

    class Config:
        from_attributes = True
