from fastapi import APIRouter
from app.api.v1.endpoints import health, users, auth, profile, nutrition, daily_target, food

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(nutrition.router, prefix="/nutrition", tags=["Nutrition"])
api_router.include_router(daily_target.router, prefix="/daily-target", tags=["DailyTarget"])
api_router.include_router(food.router, prefix="/food", tags=["Food"])