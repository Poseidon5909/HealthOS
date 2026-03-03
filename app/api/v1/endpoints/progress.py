from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.progress_service import ProgressService

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.post("/weight")
def log_weight(weight: float,
               db: Session = Depends(get_db),
               current_user = Depends(get_current_user)):
  return ProgressService.log_weight(db, current_user.id, weight)

@router.get("/weight/history")
def weight_history(db: Session = Depends(get_db),
                   current_user = Depends(get_current_user)):
  return ProgressService.get_weight_history(db, current_user.id)

@router.get("/weekly-summary")
def weekly_summary(db: Session = Depends(get_db),
                   current_user = Depends(get_current_user)):
    return ProgressService.get_weekly_weight_change(db, current_user.id)


@router.get("/consistency")
def consistency(db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):
    return ProgressService.get_consistency_summary(db, current_user.id)