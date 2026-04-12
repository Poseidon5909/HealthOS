from pydantic import BaseModel


class TokenResponse(BaseModel):
  """Token response with access and refresh tokens"""
  access_token: str
  refresh_token: str
  token_type: str = "bearer"
  expires_in: int  # minutes


class RefreshTokenRequest(BaseModel):
  """Request body for refreshing access token"""
  refresh_token: str


class TokenPayload(BaseModel):
  """JWT token payload"""
  sub: str  # user id
  type: str  # "access" or "refresh"
  exp: int  # expiration timestamp


class ForgotPasswordRequest(BaseModel):
  """Request body for forgot password"""
  email: str


class ResetPasswordRequest(BaseModel):
  """Request body for password reset"""
  token: str
  new_password: str


class VerifyEmailRequest(BaseModel):
  """Request body for email verification"""
  token: str
