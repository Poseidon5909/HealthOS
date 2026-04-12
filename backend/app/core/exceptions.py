"""
Custom exceptions for HealthOS API.
Provides structured error responses with proper HTTP status codes.
"""
from fastapi import HTTPException, status


class HealthOSException(HTTPException):
    """Base exception for HealthOS API."""
    
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class ResourceNotFoundError(HealthOSException):
    """Raised when a requested resource is not found."""
    
    def __init__(self, resource: str = "Resource", resource_id: int = None):
        detail = f"{resource} not found"
        if resource_id:
            detail = f"{resource} with id {resource_id} not found"
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class UnauthorizedError(HealthOSException):
    """Raised when authentication fails."""
    
    def __init__(self, detail: str = "Unauthorized access"):
        super().__init__(detail=detail, status_code=status.HTTP_401_UNAUTHORIZED)


class ForbiddenError(HealthOSException):
    """Raised when user doesn't have permission."""
    
    def __init__(self, detail: str = "Forbidden: insufficient permissions"):
        super().__init__(detail=detail, status_code=status.HTTP_403_FORBIDDEN)


class DuplicateError(HealthOSException):
    """Raised when attempting to create a duplicate resource."""
    
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)


class ValidationError(HealthOSException):
    """Raised when input validation fails."""
    
    def __init__(self, detail: str = "Validation error"):
        super().__init__(detail=detail, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
