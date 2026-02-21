from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user_profile import UserProfile


def create_profile(db: Session, user_id: int, data):
    existing = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )

    profile = UserProfile(user_id=user_id, **data.dict())

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


def update_profile(db: Session, user_id: int, data):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    for key, value in data.dict().items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    return profile


def get_profile(db: Session, user_id: int):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile
