from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.database import get_db
from app.services.auth_service import authenticate_user, refresh_access_token, reset_password_with_token
from app.core.security import get_current_user, verify_password_reset_token
from app.schemas.auth import TokenResponse, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.services.email_service import EmailService
from app.models.user import User

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


@router.post("/forgot-password")
@limiter.limit("3/hour")  # Strict limit to prevent abuse
def forgot_password(
    request: Request,
    forgot_data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset email.
    
    - **email**: User's email address
    
    Sends password reset link to the email if account exists.
    For security, always returns success even if email doesn't exist.
    
    Rate limit: 3 attempts per hour to prevent abuse.
    """
    # Always return success to prevent user enumeration
    # But only send email if user exists
    user = db.query(User).filter(User.email == forgot_data.email).first()
    
    if user:
        try:
            EmailService.send_password_reset_email(user.email, user.name)
        except Exception as e:
            print(f"Failed to send password reset email: {str(e)}")
    
    return {
        "message": "If the email exists, a password reset link has been sent"
    }


@router.post("/reset-password")
@limiter.limit("5/hour")  # Moderate limit for password reset
def reset_password(
    request: Request,
    reset_data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Reset password using reset token.
    
    - **token**: Password reset token from email
    - **new_password**: New strong password
    
    Rate limit: 5 attempts per hour.
    """
    return reset_password_with_token(
        db,
        reset_data.token,
        reset_data.new_password
    )