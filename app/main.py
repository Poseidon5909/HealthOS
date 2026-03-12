from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.api.router import api_router
from app.models import user_profile
from app.models import daily_target
from app.models import food_item
from app.models import food_log
from app.models import exercise
from app.models import workout_log
from app.models import water_log
from app.models import weight_log
from app.models import habit_log


# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.APP_NAME,
    description="HealthOS API - Comprehensive health tracking platform",
    version="1.0.0"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Global Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with structured responses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.detail,
                "status_code": exc.status_code,
                "type": "HTTPException"
            }
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with detailed field information."""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": " -> ".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "message": "Validation error",
                "status_code": 422,
                "type": "ValidationError",
                "details": errors
            }
        }
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handle database errors securely."""
    # Log the actual error for debugging
    import logging
    logging.error(f"Database error: {exc}")
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "message": "Database error occurred. Please try again later.",
                "status_code": 500,
                "type": "DatabaseError"
            }
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors securely."""
    # Log the actual error for debugging
    import traceback
    import logging
    logging.error(f"Unexpected error: {exc}")
    logging.error(traceback.format_exc())
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "message": "An unexpected error occurred. Please contact support if the issue persists.",
                "status_code": 500,
                "type": "InternalServerError"
            }
        }
    )

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
def root(request: Request):
    return {"message": "HealthOS Backend Running"}

from app.core.database import engine, Base, get_db
from app.models import user  # Import to register model
from app.services.food_service import FoodService
from app.seeds.exercise_seed import seed_exercises
from app.seeds.serving_size_seed import seed_serving_sizes


Base.metadata.create_all(bind=engine)

# Seed initial data
db = next(get_db())
FoodService.seed_initial_data(db)
seed_exercises(db)
seed_serving_sizes(db)
db.close()