"""
Validation utilities for HealthOS application.
"""
from datetime import date, datetime
from typing import Optional
from pydantic import validator


def validate_not_future_date(v: Optional[date]) -> Optional[date]:
    """Validator to ensure date is not in the future."""
    if v and v > date.today():
        raise ValueError("Date cannot be in the future")
    return v


def validate_positive(v: float, field_name: str = "Value") -> float:
    """Validator to ensure value is positive."""
    if v is not None and v <= 0:
        raise ValueError(f"{field_name} must be positive")
    return v


def validate_reasonable_weight(v: Optional[float]) -> Optional[float]:
    """Validator for weight (20-500 kg)."""
    if v is not None:
        if v < 20:
            raise ValueError("Weight must be at least 20 kg")
        if v > 500:
            raise ValueError("Weight cannot exceed 500 kg")
    return v


def validate_reasonable_calories(v: Optional[float]) -> Optional[float]:
    """Validator for calories (max 10000 per entry)."""
    if v is not None:
        if v < 0:
            raise ValueError("Calories cannot be negative")
        if v > 10000:
            raise ValueError("Single food entry cannot exceed 10,000 calories")
    return v


def validate_workout_duration(v: Optional[int]) -> Optional[int]:
    """Validator for workout duration (1-720 minutes = 12 hours max)."""
    if v is not None:
        if v < 1:
            raise ValueError("Workout duration must be at least 1 minute")
        if v > 720:
            raise ValueError("Workout duration cannot exceed 720 minutes (12 hours)")
    return v


def validate_water_amount(v: Optional[int]) -> Optional[int]:
    """Validator for water amount (1-5000 ml per log)."""
    if v is not None:
        if v < 1:
            raise ValueError("Water amount must be at least 1 ml")
        if v > 5000:
            raise ValueError("Single water log cannot exceed 5000 ml (5 liters)")
    return v


def validate_portion_size(v: Optional[float]) -> Optional[float]:
    """Validator for food portion (1-5000 grams)."""
    if v is not None:
        if v < 1:
            raise ValueError("Portion size must be at least 1 gram")
        if v > 5000:
            raise ValueError("Portion size cannot exceed 5000 grams (5 kg)")
    return v


def validate_target_values(v: Optional[int], min_val: int, max_val: int, field_name: str) -> Optional[int]:
    """Generic validator for daily target values."""
    if v is not None:
        if v < min_val:
            raise ValueError(f"{field_name} must be at least {min_val}")
        if v > max_val:
            raise ValueError(f"{field_name} cannot exceed {max_val}")
    return v
