from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.database import get_db
from app.services.auth_service import authenticate_user, refresh_access_token
from app.core.security import get_current_user
from app.schemas.auth import TokenResponse, RefreshTokenRequest

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")  # Strict limit for login attempts
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login endpoint that returns access and refresh tokens.
    
    - **username**: User's email address
    - **password**: User's password
    
    Returns access token (short-lived) and refresh token (long-lived).
    
    Rate limit: 5 attempts per minute to prevent brute force attacks.
    """
    token_data = authenticate_user(
        db,
        email=form_data.username,   # OAuth2 uses "username"
        password=form_data.password
    )

    return token_data


@router.post("/refresh")
@limiter.limit("10/minute")  # Moderate limit for token refresh
def refresh_token(
    request: Request,
    token_request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using a valid refresh token.
    
    - **refresh_token**: Valid refresh token from login
    
    Returns a new access token without requiring re-authentication.
    
    Rate limit: 10 attempts per minute.
    """
    return refresh_access_token(db, token_request.refresh_token)


@router.get("/protected")
def protected_route(current_user=Depends(get_current_user)):
    """
    Example protected endpoint requiring authentication.
    """
    return {"message": f"Welcome {current_user.name}"}