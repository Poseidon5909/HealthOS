from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import authenticate_user
from app.core.security import get_current_user

router = APIRouter()


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    token = authenticate_user(
        db,
        email=form_data.username,   # OAuth2 uses "username"
        password=form_data.password
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@router.get("/protected")
def protected_route(current_user=Depends(get_current_user)):
    return {"message": f"Welcome {current_user.name}"}