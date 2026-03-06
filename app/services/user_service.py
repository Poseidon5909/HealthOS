"""
User management service for HealthOS.
Handles user account operations like password changes, profile updates, and account deletion.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import hash_password, verify_password


class UserService:
    
    @staticmethod
    def change_password(db: Session, user_id: int, old_password: str, new_password: str):
        """Change user password after verifying old password."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify old password
        if not verify_password(old_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )
        
        # Check if new password is same as old
        if old_password == new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different from current password"
            )
        
        # Update password
        user.password_hash = hash_password(new_password)
        db.commit()
        
        return {"message": "Password changed successfully"}
    
    @staticmethod
    def update_user_profile(db: Session, user_id: int, name: str = None, email: str = None):
        """Update user profile information."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update name if provided
        if name is not None:
            user.name = name
        
        # Update email if provided and check for duplicates
        if email is not None:
            if email != user.email:
                existing = db.query(User).filter(User.email == email).first()
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email already in use"
                    )
                user.email = email
                user.email_verified = False  # Reset verification on email change
        
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def deactivate_account(db: Session, user_id: int, password: str):
        """Deactivate user account (soft delete)."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify password for security
        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password is incorrect"
            )
        
        user.is_active = False
        db.commit()
        
        return {"message": "Account deactivated successfully"}
    
    @staticmethod
    def delete_account(db: Session, user_id: int, password: str):
        """Permanently delete user account."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify password for security
        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password is incorrect"
            )
        
        db.delete(user)
        db.commit()
        
        return {"message": "Account deleted permanently"}
    
    @staticmethod
    def verify_email(db: Session, user_id: int):
        """Mark user email as verified."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.email_verified = True
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        """Get user by ID."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user
