from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/", response_model=DashboardResponse)
def get_dashboard(
  db: Session = Depends(get_db),
  current_user = Depends(get_current_user)):

  return DashboardService.get_dashboard(
    db=db,
    user_id=current_user.id
  )