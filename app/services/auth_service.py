from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import verify_password, create_access_token

def authenticate_user(db: Session, email: str, password: str):

  user = db.query(User).filter(User.email == email).first()

  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid credentials"
    )
  
  if not verify_password(password, user.password_hash):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid credentials"
    )
  
  access_token = create_access_token(
    data={"sub": str(user.id)}
  )

  return access_token