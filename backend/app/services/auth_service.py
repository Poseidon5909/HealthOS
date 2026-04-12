from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import json
import secrets
from urllib import parse, request
from app.models.user import User
from app.core.security import (
    verify_password, 
    create_access_token, 
    create_refresh_token, 
    verify_token_type,
    verify_password_reset_token,
    hash_password
)
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


def get_google_authorization_url() -> str:
  if not settings.GOOGLE_CLIENT_ID:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Google OAuth is not configured"
    )

  query = parse.urlencode({
    "client_id": settings.GOOGLE_CLIENT_ID,
    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
    "response_type": "code",
    "scope": "openid email profile",
    "access_type": "offline",
    "prompt": "select_account"
  })

  return f"https://accounts.google.com/o/oauth2/v2/auth?{query}"


def _exchange_google_code_for_id_token(code: str) -> str:
  if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Google OAuth is not configured"
    )

  payload = parse.urlencode({
    "code": code,
    "client_id": settings.GOOGLE_CLIENT_ID,
    "client_secret": settings.GOOGLE_CLIENT_SECRET,
    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
    "grant_type": "authorization_code"
  }).encode("utf-8")

  token_request = request.Request(
    "https://oauth2.googleapis.com/token",
    data=payload,
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    method="POST"
  )

  try:
    with request.urlopen(token_request, timeout=10) as response:
      token_data = json.loads(response.read().decode("utf-8"))
  except Exception:
    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail="Failed to complete Google authentication"
    )

  id_token = token_data.get("id_token")
  if not id_token:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Google did not return a valid identity token"
    )

  return id_token


def _get_google_profile(id_token: str) -> dict:
  tokeninfo_url = "https://oauth2.googleapis.com/tokeninfo?" + parse.urlencode({"id_token": id_token})

  try:
    with request.urlopen(tokeninfo_url, timeout=10) as response:
      profile = json.loads(response.read().decode("utf-8"))
  except Exception:
    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail="Unable to verify Google identity token"
    )

  if profile.get("aud") != settings.GOOGLE_CLIENT_ID:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Google token audience mismatch"
    )

  if str(profile.get("email_verified", "false")).lower() != "true":
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Google email is not verified"
    )

  email = profile.get("email")
  if not email:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Google account email is unavailable"
    )

  return {
    "email": email,
    "name": profile.get("name") or email.split("@")[0],
  }


def authenticate_google_user(db: Session, code: str):
  id_token = _exchange_google_code_for_id_token(code)
  google_user = _get_google_profile(id_token)

  # Link flow: if email already exists, sign in to that account.
  # If email doesn't exist, create a new account linked by the same email.
  user = db.query(User).filter(User.email == google_user["email"]).first()

  if not user:
    user = User(
      name=google_user["name"],
      email=google_user["email"],
      password_hash=hash_password(secrets.token_urlsafe(32)),
      is_active=True,
      email_verified=True,
      role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

  if not user.is_active:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Account is deactivated. Please contact support."
    )

  if not user.email_verified:
    user.email_verified = True
    db.commit()
    db.refresh(user)

  access_token = create_access_token(data={"sub": str(user.id)})
  refresh_token = create_refresh_token(data={"sub": str(user.id)})

  return {
    "access_token": access_token,
    "refresh_token": refresh_token,
    "token_type": "bearer",
    "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES
  }


def reset_password_with_token(db: Session, token: str, new_password: str):
  """Reset user password using valid reset token"""
  
  # Verify token and get email
  email = verify_password_reset_token(token)
  
  # Find user by email
  user = db.query(User).filter(User.email == email).first()
  if not user:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="User not found"
    )
  
  # Check if account is active
  if not user.is_active:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Account is deactivated. Please contact support."
    )
  
  # Update password
  user.password_hash = hash_password(new_password)
  db.commit()
  
  return {
    "message": "Password reset successfully. Please login with your new password."
  }