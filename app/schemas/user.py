from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from app.core.password_validator import validate_password_for_pydantic

class UserCreate(BaseModel):
  name: str = Field(..., min_length=1, max_length=100, description="User's full name")
  email: EmailStr
  password: str = Field(..., min_length=8, max_length=100, description="Password (min 8 characters)")
  
  @validator('name')
  def validate_name(cls, v):
    if not v or not v.strip():
      raise ValueError("Name cannot be empty")
    if len(v) > 100:
      raise ValueError("Name cannot exceed 100 characters")
    return v.strip()
  
  @validator('password')
  def validate_password(cls, v):
    return validate_password_for_pydantic(v)

class UserResponse(BaseModel):
  id: int
  name: str
  email: EmailStr
  is_active: bool
  email_verified: bool
  role: str
  created_at: datetime

  class Config:
    from_attributes = True

class UserLogin(BaseModel):
  email: EmailStr
  password: str

class PasswordChange(BaseModel):
  old_password: str
  new_password: str = Field(..., min_length=8, max_length=100)
  
  @validator('new_password')
  def validate_new_password(cls, v):
    return validate_password_for_pydantic(v)

class UserUpdate(BaseModel):
  name: Optional[str] = Field(None, min_length=1, max_length=100)
  email: Optional[EmailStr] = None
  
  @validator('name')
  def validate_name(cls, v):
    if v is not None:
      if not v or not v.strip():
        raise ValueError("Name cannot be empty")
      if len(v) > 100:
        raise ValueError("Name cannot exceed 100 characters")
    return v.strip() if v else v