from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate, PasswordChange
from app.core.security import hash_password, get_current_user
from app.services.user_service import UserService

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/", response_model=UserResponse, status_code=201)
@limiter.limit("3/hour")  # Limit registrations to prevent spam
def create_user(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    
    - **name**: Full name (1-100 characters)
    - **email**: Valid email address (must be unique)
    - **password**: Strong password (min 8 chars, uppercase, lowercase, digit, special char)
    
    Rate limit: 3 registrations per hour per IP address.
    """
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        is_active=True,
        email_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current authenticated user's profile."""
    return UserService.get_user_by_id(db, current_user.id)


@router.put("/me", response_model=UserResponse)
def update_user_profile(
    user_data: UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile information.
    
    - **name**: Updated full name (optional)
    - **email**: Updated email address (optional, must be unique)
    
    Note: Changing email will reset email verification status.
    """
    return UserService.update_user_profile(
        db,
        current_user.id,
        user_data.name,
        user_data.email
    )


@router.post("/me/change-password")
@limiter.limit("5/hour")  # Limit password changes to prevent abuse
def change_password(
    request: Request,
    password_data: PasswordChange,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change current user's password.
    
    - **old_password**: Current password for verification
    - **new_password**: New strong password
    
    Rate limit: 5 attempts per hour.
    """
    return UserService.change_password(
        db,
        current_user.id,
        password_data.old_password,
        password_data.new_password
    )


@router.post("/me/verify-email", response_model=UserResponse)
def verify_email(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark current user's email as verified.
    
    Note: In production, this should be protected by email verification token.
    This is a simplified version for development.
    """
    return UserService.verify_email(db, current_user.id)


@router.post("/me/deactivate")
@limiter.limit("2/day")  # Strict limit for account deactivation
def deactivate_account(
    request: Request,
    password: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deactivate current user's account (soft delete).
    
    - **password**: Current password for verification
    
    Account can be reactivated by contacting support.
    Rate limit: 2 attempts per day.
    """
    return UserService.deactivate_account(db, current_user.id, password)


@router.delete("/me")
@limiter.limit("1/day")  # Very strict limit for account deletion
def delete_account(
    request: Request,
    password: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete current user's account.
    
    - **password**: Current password for verification
    
    Warning: This action cannot be undone!
    Rate limit: 1 attempt per day.
    """
    return UserService.delete_account(db, current_user.id, password)