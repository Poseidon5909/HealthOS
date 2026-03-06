from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import verify_password, create_access_token, create_refresh_token, verify_token_type
from app.core.config import settings

def authenticate_user(db: Session, email: str, password: str):

  user = db.query(User).filter(User.email == email).first()

  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid credentials"
    )
  
  # Check if account is active
  if not user.is_active:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Account is deactivated. Please contact support."
    )
  
  if not verify_password(password, user.password_hash):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid credentials"
    )
  
  # Create both access and refresh tokens
  access_token = create_access_token(data={"sub": str(user.id)})
  refresh_token = create_refresh_token(data={"sub": str(user.id)})

  return {
    "access_token": access_token,
    "refresh_token": refresh_token,
    "token_type": "bearer",
    "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES
  }


def refresh_access_token(db: Session, refresh_token: str):
  """Generate new access token from valid refresh token"""
  
  # Verify it's a refresh token
  payload = verify_token_type(refresh_token, "refresh")
  
  user_id = payload.get("sub")
  if not user_id:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid token payload"
    )
  
  # Verify user still exists and is active
  user = db.query(User).filter(User.id == int(user_id)).first()
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="User not found"
    )
  
  if not user.is_active:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Account is deactivated"
    )
  
  # Create new access token
  access_token = create_access_token(data={"sub": str(user.id)})
  
  return {
    "access_token": access_token,
    "token_type": "bearer",
    "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES
  }