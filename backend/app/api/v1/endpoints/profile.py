from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.services.profile_service import create_profile, update_profile, get_profile

router = APIRouter()


@router.post("/", response_model=ProfileResponse)
def create_user_profile(
    data: ProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return create_profile(db, current_user.id, data)


@router.put("/", response_model=ProfileResponse)
def update_user_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return update_profile(db, current_user.id, data)


@router.get("/", response_model=ProfileResponse)
def get_current_user_profile(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_profile(db, current_user.id)
