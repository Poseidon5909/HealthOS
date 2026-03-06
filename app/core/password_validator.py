"""
Reusable password validation logic for HealthOS.
Ensures password strength requirements are consistent across the application.
"""
import re
from typing import Tuple


def validate_password_strength(password: str) -> Tuple[bool, str]:
    """
    Validate password strength requirements.
    
    Args:
        password: The password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if len(password) > 100:
        return False, "Password cannot exceed 100 characters"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    
    return True, ""


def validate_password_for_pydantic(value: str) -> str:
    """
    Validator function for Pydantic models.
    
    Args:
        value: Password value to validate
        
    Returns:
        The validated password
        
    Raises:
        ValueError: If password doesn't meet requirements
    """
    is_valid, error_message = validate_password_strength(value)
    if not is_valid:
        raise ValueError(error_message)
    return value
