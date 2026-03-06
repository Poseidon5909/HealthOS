# HealthOS - Complete Project Documentation
## Easy-to-Understand Guide

---

## 📋 Table of Contents
1. [What is HealthOS?](#what-is-healthos)
2. [Technologies Used (Tech Stack)](#technologies-used)
3. [Project Structure](#project-structure)
4. [Core Concepts Explained](#core-concepts)
5. [How the Application Works](#how-it-works)
6. [Database Models](#database-models)
7. [API Endpoints](#api-endpoints)
8. [Security Features](#security-features)
9. [Key Components Deep Dive](#key-components)
10. [Common Patterns Used](#common-patterns)

---

## 🎯 What is HealthOS?

HealthOS is a **health tracking API** (Application Programming Interface) that helps users track their:
- 🍔 **Food intake** (calories, protein, carbs, fats)
- 💪 **Workouts** (exercises, duration, calories burned)
- 💧 **Water consumption** (hydration tracking)
- ⚖️ **Weight progress** (track weight changes over time)
- 📋 **Daily habits** (track streaks and completion)
- 📊 **Dashboard** (overview of all health metrics)

**Think of it as the backend (server-side) for a fitness app like MyFitnessPal or Fitbit.**

---

## 🛠️ Technologies Used (Tech Stack)

### 1. **FastAPI** (v0.129.0)
- **What it is**: A modern Python web framework for building APIs
- **Why we use it**: 
  - Very fast (as fast as Node.js)
  - Automatic API documentation
  - Built-in data validation
  - Easy to learn and use
- **Simple analogy**: Like a waiter that takes orders (API requests) and brings food (responses)

### 2. **PostgreSQL** (Database)
- **What it is**: A powerful relational database
- **Why we use it**: 
  - Stores all user data, food logs, workouts, etc.
  - Reliable and handles lots of data
  - Supports complex queries
- **Simple analogy**: Like a digital filing cabinet that organizes all your information

### 3. **SQLAlchemy** (v2.0.46)
- **What it is**: An ORM (Object-Relational Mapping) tool
- **Why we use it**: 
  - Lets us work with database using Python code instead of SQL
  - Automatically converts Python objects to database rows
- **Simple analogy**: A translator between Python and the database
- **Example**:
  ```python
  # Instead of SQL: SELECT * FROM users WHERE email = 'john@example.com'
  # We write Python: 
  user = db.query(User).filter(User.email == 'john@example.com').first()
  ```

### 4. **Pydantic** (v2.12.5)
- **What it is**: Data validation library
- **Why we use it**: 
  - Ensures data is correct before processing
  - Automatic error messages for invalid data
  - Type checking
- **Simple analogy**: A security guard checking IDs before letting people in
- **Example**:
  ```python
  class UserCreate(BaseModel):
      email: str  # Must be a string
      age: int = Field(gt=0, lt=150)  # Must be between 0 and 150
  ```

### 5. **JWT (JSON Web Tokens)** via python-jose
- **What it is**: A secure way to authenticate users
- **Why we use it**: 
  - No need to store session data on server
  - Tokens can expire automatically
  - Secure and tamper-proof
- **Simple analogy**: Like a movie ticket - it has info about you encoded in it, and staff can verify it's real
- **How it works**: 
  1. User logs in → Server creates token
  2. User sends token with each request
  3. Server verifies token is valid

### 6. **Argon2** (via argon2-cffi)
- **What it is**: Password hashing algorithm
- **Why we use it**: 
  - Most secure way to store passwords
  - Even if database is stolen, passwords are safe
  - Industry standard (better than bcrypt)
- **Simple analogy**: A one-way shredder - you can shred a document but can't un-shred it
- **Example**:
  ```python
  # Original password: "MyPassword123!"
  # Stored in database: "$argon2id$v=19$m=65536,t=3,p=4$xyz..."
  ```

### 7. **SlowAPI** (v0.1.9)
- **What it is**: Rate limiting library
- **Why we use it**: 
  - Prevents abuse (too many requests)
  - Protects against brute force attacks
  - Limits how many times someone can call an endpoint
- **Simple analogy**: Like a bouncer limiting how many times you can enter a club per hour
- **Example**:
  ```python
  @limiter.limit("5/minute")  # Only 5 requests per minute allowed
  def login():
      pass
  ```

### 8. **Uvicorn** (v0.41.0)
- **What it is**: ASGI server
- **Why we use it**: 
  - Runs the FastAPI application
  - Handles incoming HTTP requests
  - Very fast and async
- **Simple analogy**: The engine that runs your application

### 9. **Other Dependencies**
- **python-multipart**: Handles file uploads and form data
- **email-validator**: Validates email addresses
- **python-dotenv**: Loads environment variables from .env file
- **passlib**: Password hashing utilities
- **psycopg2-binary**: PostgreSQL database driver

---

## 📁 Project Structure

```
HealthOS/
│
├── app/                          # Main application folder
│   ├── main.py                   # Entry point - starts the application
│   │
│   ├── api/                      # API routes/endpoints
│   │   ├── router.py             # Combines all routes together
│   │   └── v1/endpoints/         # Version 1 API endpoints
│   │       ├── auth.py           # Login, logout, token refresh
│   │       ├── users.py          # User registration, management
│   │       ├── food_log.py       # Log meals
│   │       ├── workout.py        # Log workouts
│   │       ├── hydration.py      # Log water intake
│   │       ├── progress.py       # View weight progress
│   │       ├── habit.py          # Track habits
│   │       └── dashboard.py      # Dashboard overview
│   │
│   ├── core/                     # Core functionality
│   │   ├── config.py             # App configuration (settings)
│   │   ├── database.py           # Database connection setup
│   │   ├── security.py           # JWT tokens, password hashing
│   │   ├── validators.py         # Custom validation functions
│   │   ├── password_validator.py # Password strength checking
│   │   └── exceptions.py         # Custom error classes
│   │
│   ├── models/                   # Database tables (SQLAlchemy)
│   │   ├── user.py              # User table
│   │   ├── food_log.py          # Food log table
│   │   ├── workout_log.py       # Workout log table
│   │   ├── water_log.py         # Water intake table
│   │   ├── weight_log.py        # Weight tracking table
│   │   └── habit_log.py         # Habit tracking table
│   │
│   ├── schemas/                  # Pydantic models (validation)
│   │   ├── auth.py              # Login/token schemas
│   │   ├── user.py              # User data schemas
│   │   ├── food_log.py          # Food log schemas
│   │   ├── workout.py           # Workout schemas
│   │   └── ...                  # Other schemas
│   │
│   ├── services/                 # Business logic layer
│   │   ├── auth_service.py      # Authentication logic
│   │   ├── user_service.py      # User management logic
│   │   ├── food_log_service.py  # Food logging logic
│   │   └── ...                  # Other services
│   │
│   └── seeds/                    # Initial data
│       └── exercise_seed.py     # Pre-load exercises into database
│
├── requirements.txt              # All Python packages needed
├── README.md                     # Project overview
└── .env                          # Environment variables (not in git)
```

---

## 🧠 Core Concepts Explained

### 1. **MVC-like Architecture** (Actually MVS - Model-View-Service)

```
User Request → Endpoint (Router) → Service → Model → Database
           ← Response ←            ←         ←       ←
```

**Explanation**:
- **Models** (`app/models/`): Define database tables
- **Schemas** (`app/schemas/`): Define what data is valid
- **Services** (`app/services/`): Business logic (the brain)
- **Endpoints** (`app/api/v1/endpoints/`): Routes that users call

**Simple analogy**: 
- **Restaurant analogy**:
  - Endpoint = Waiter (takes orders)
  - Service = Chef (prepares food)
  - Model = Recipe (structure)
  - Database = Pantry (storage)

### 2. **Dependency Injection**

FastAPI's way of sharing resources across endpoints.

```python
def get_db():
    """Creates database connection"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    # 'db' is automatically provided by FastAPI
    return db.query(User).all()
```

**Why it's useful**: 
- No need to manually create/close database connections
- Easy to test (can inject mock data)
- Clean code

### 3. **Authentication Flow**

```
1. User registers → Password hashed → Stored in database
2. User logs in → Password verified → JWT tokens created
3. User accesses protected route → Token verified → Access granted
```

**Two types of tokens**:
- **Access Token**: Short-lived (30 minutes) - used for API requests
- **Refresh Token**: Long-lived (7 days) - used to get new access token

**Why two tokens?**
- Security: If access token is stolen, it expires quickly
- Convenience: User doesn't need to log in every 30 minutes

### 4. **Rate Limiting**

Prevents abuse by limiting requests per time period.

```python
@router.post("/login")
@limiter.limit("5/minute")  # Only 5 login attempts per minute
def login():
    pass
```

**Different limits for different endpoints**:
- Login: 5/minute (prevent brute force)
- Registration: 3/hour (prevent spam)
- General endpoints: 60/minute (prevent overload)

### 5. **Database Relationships**

How tables connect to each other:

```
User (1) ←→ (Many) FoodLog
  │
  └─→ (1:1) UserProfile
  │
  └─→ (Many) WorkoutLog
  │
  └─→ (Many) WaterLog
```

**Example**: One user can have many food logs, but each food log belongs to one user.

---

## 💾 Database Models (Tables)

### 1. **User Table**
Stores user account information.

```python
class User:
    id: int                      # Unique identifier
    name: str                    # User's full name
    email: str                   # Email (must be unique)
    password_hash: str           # Hashed password (not plain text!)
    is_active: bool              # Can user log in?
    email_verified: bool         # Has email been verified?
    created_at: datetime         # When account was created
    updated_at: datetime         # Last profile update
```

**Relationships**:
- Has one profile
- Has many food logs, workout logs, water logs, etc.

### 2. **FoodLog Table**
Tracks what users eat.

```python
class FoodLog:
    id: int                      # Unique identifier
    user_id: int                 # Which user logged this?
    food_id: int                 # Which food item?
    quantity_grams: float        # How much? (in grams)
    calculated_calories: float   # Total calories for this amount
    calculated_protein: float    # Total protein (grams)
    calculated_fat: float        # Total fat (grams)
    calculated_carbs: float      # Total carbs (grams)
    date: date                   # When was this eaten?
    created_at: datetime         # When was this logged?
```

**Business rules**:
- Quantity must be positive
- Calories must be 0-10,000 per entry
- Can't log future dates
- One food item can only be logged once per exact timestamp

### 3. **WorkoutLog Table**
Tracks exercise sessions.

```python
class WorkoutLog:
    id: int                      # Unique identifier
    user_id: int                 # Which user?
    exercise_id: int             # Which exercise?
    duration_minutes: int        # How long? (1-720 minutes max)
    calories_burned: float       # Calculated calories burned
    date: date                   # When was workout?
    notes: str (optional)        # Optional notes
    created_at: datetime         # When logged?
```

**Business rules**:
- Duration: 1-720 minutes (12 hours max)
- Calories burned calculated based on exercise and duration
- Can't log future workouts

### 4. **WaterLog Table**
Tracks daily water intake.

```python
class WaterLog:
    id: int                      # Unique identifier
    user_id: int                 # Which user?
    amount_ml: int               # How much water? (in milliliters)
    date: date                   # Which day?
    logged_at: datetime          # When logged?
```

**Business rules**:
- Amount: 1-5,000 ml per log (1ml to 5 liters)
- Can't log future dates

### 5. **WeightLog Table**
Tracks weight over time.

```python
class WeightLog:
    id: int                      # Unique identifier
    user_id: int                 # Which user?
    weight_kg: float             # Weight in kilograms
    date: date                   # When was weight recorded?
    notes: str (optional)        # Optional notes
```

**Business rules**:
- Weight: 20-500 kg (realistic range)
- Can't log future dates
- Used to track progress over time

### 6. **HabitLog Table**
Tracks daily habits and streaks.

```python
class HabitLog:
    id: int                      # Unique identifier
    user_id: int                 # Which user?
    habit_name: str              # What habit? (e.g., "Read 30 minutes")
    completed: bool              # Did user complete it?
    date: date                   # Which day?
    notes: str (optional)        # Optional notes
```

**Features**:
- Track habit completion
- Calculate streaks
- View completion rate

---

## 🔌 API Endpoints

### **Authentication Endpoints** (`/auth`)

#### 1. `POST /auth/login`
**Purpose**: Log in and get access tokens

**Request**:
```json
{
  "username": "user@example.com",  // OAuth2 uses "username" field
  "password": "MyPassword123!"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 30  // minutes
}
```

**Rate limit**: 5 attempts/minute

---

#### 2. `POST /auth/refresh`
**Purpose**: Get new access token without logging in again

**Request**:
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response**:
```json
{
  "access_token": "eyJhbGc...",  // New access token
  "token_type": "bearer",
  "expires_in": 30
}
```

**Rate limit**: 10 attempts/minute

---

### **User Endpoints** (`/users`)

#### 3. `POST /users/register`
**Purpose**: Create new user account

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Password requirements**:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One digit
- One special character (!@#$%^&*...)

**Rate limit**: 3 registrations/hour

---

### **Food Log Endpoints** (`/food-log`)

#### 4. `POST /food-log`
**Purpose**: Log a meal

**Request**:
```json
{
  "food_id": 123,
  "quantity_grams": 150,
  "date": "2026-03-06"
}
```

**What happens**:
1. System looks up food item details (calories per 100g)
2. Calculates total nutrition based on quantity
3. Saves to database

---

#### 5. `GET /food-log?date=2026-03-06`
**Purpose**: Get all food logs for a specific date

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "food_name": "Chicken Breast",
      "quantity_grams": 150,
      "calculated_calories": 248,
      "calculated_protein": 47,
      "calculated_fat": 5,
      "calculated_carbs": 0
    }
  ],
  "total_calories": 248,
  "total_protein": 47
}
```

---

### **Workout Endpoints** (`/workouts`)

#### 6. `POST /workouts`
**Purpose**: Log a workout

**Request**:
```json
{
  "exercise_id": 5,
  "duration_minutes": 45,
  "date": "2026-03-06",
  "notes": "Felt strong today!"
}
```

**System automatically calculates**: Calories burned based on exercise type and duration

---

### **Hydration Endpoints** (`/hydration`)

#### 7. `POST /hydration/log`
**Purpose**: Log water intake

**Request**:
```json
{
  "amount_ml": 500,
  "date": "2026-03-06"
}
```

---

#### 8. `GET /hydration/daily?date=2026-03-06`
**Purpose**: Get total water intake for a day

**Response**:
```json
{
  "date": "2026-03-06",
  "total_water_ml": 2000,
  "goal_ml": 2500,
  "percentage": 80,
  "logs": [
    {"time": "08:00", "amount_ml": 500},
    {"time": "12:30", "amount_ml": 1500}
  ]
}
```

---

### **Progress Endpoints** (`/progress`)

#### 9. `GET /progress/weight?start_date=2026-01-01&end_date=2026-03-06`
**Purpose**: View weight progress over time

**Response**:
```json
{
  "start_weight": 80.0,
  "current_weight": 75.5,
  "change_kg": -4.5,
  "change_percentage": -5.6,
  "logs": [
    {"date": "2026-01-01", "weight_kg": 80.0},
    {"date": "2026-02-01", "weight_kg": 77.5},
    {"date": "2026-03-06", "weight_kg": 75.5}
  ]
}
```

---

### **Dashboard Endpoint** (`/dashboard`)

#### 10. `GET /dashboard?date=2026-03-06`
**Purpose**: Get overview of all health metrics for a day

**Response**:
```json
{
  "date": "2026-03-06",
  "nutrition": {
    "calories": 1850,
    "protein": 120,
    "carbs": 200,
    "fat": 60
  },
  "hydration": {
    "total_ml": 2000,
    "goal_ml": 2500
  },
  "workouts": {
    "count": 1,
    "total_duration": 45,
    "calories_burned": 350
  },
  "weight": {
    "current": 75.5,
    "change_from_yesterday": -0.2
  },
  "habits": {
    "completed": 5,
    "total": 7,
    "completion_rate": 71
  }
}
```

---

## 🔒 Security Features

### 1. **Password Security**

**Hashing with Argon2**:
```python
# When user registers:
plain_password = "MyPassword123!"
hashed_password = "$argon2id$v=19$m=65536,t=3,p=4$..."  # Stored in DB

# When user logs in:
if verify_password(plain_password, hashed_password):
    # Login successful
```

**Why Argon2?**
- Memory-hard (resists GPU attacks)
- Configurable difficulty
- Industry standard for 2026

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase: A-Z
- At least one lowercase: a-z
- At least one digit: 0-9
- At least one special character: !@#$%^&*...

---

### 2. **JWT Token Authentication**

**Token Structure**:
```json
{
  "sub": "123",           // User ID
  "type": "access",       // Token type (access or refresh)
  "exp": 1709737200       // Expiration timestamp
}
```

**How it works**:
1. User logs in with email/password
2. Server verifies credentials
3. Server creates JWT token containing user ID
4. Server signs token with SECRET_KEY
5. User receives token
6. User sends token with every request
7. Server verifies token signature

**Token Security**:
- Tokens are signed (can't be tampered with)
- Tokens expire automatically
- Access tokens: 30 minutes (short-lived)
- Refresh tokens: 7 days (long-lived)
- Different tokens for different purposes

---

### 3. **Rate Limiting**

Prevents abuse by limiting request frequency.

```python
Endpoint                  | Rate Limit      | Why?
--------------------------|-----------------|---------------------------
POST /auth/login          | 5/minute        | Prevent brute force
POST /auth/refresh        | 10/minute       | Prevent token abuse
POST /users/register      | 3/hour          | Prevent spam accounts
PUT /users/change-password| 5/hour          | Prevent password guessing
DELETE /users/deactivate  | 2/day           | Serious action
DELETE /users/delete      | 1/day           | Very serious action
All other endpoints       | 60/minute       | General protection
```

**How it works**:
- Tracks requests by IP address
- Returns 429 status code if limit exceeded
- Resets after time window passes

---

### 4. **Security Headers**

Added to every response to protect against common attacks.

```python
X-Content-Type-Options: nosniff
# Prevents MIME type sniffing attacks

X-Frame-Options: DENY
# Prevents clickjacking (embedding site in iframe)

X-XSS-Protection: 1; mode=block
# Enables browser XSS filter

Strict-Transport-Security: max-age=31536000; includeSubDomains
# Forces HTTPS connection
```

---

### 5. **CORS (Cross-Origin Resource Sharing)**

Controls which websites can access the API.

```python
# Configured in main.py
CORS_ORIGINS = [
    "http://localhost:3000",  # React frontend
    "http://localhost:8000"   # API docs
]
```

**Why needed?**
- Browsers block requests from different domains by default
- CORS allows specific domains to access API
- Prevents unauthorized websites from stealing data

---

### 6. **Input Validation**

All data validated before processing using Pydantic.

```python
class FoodLogCreate(BaseModel):
    food_id: int = Field(gt=0)  # Must be positive
    quantity_grams: float = Field(gt=0, le=5000)  # 1 to 5000g
    date: date  # Must be valid date
    
    @validator('date')
    def date_not_future(cls, v):
        if v > date.today():
            raise ValueError("Cannot log future dates")
        return v
```

**Prevents**:
- SQL injection
- Invalid data types
- Out-of-range values
- Future dates
- Negative quantities

---

### 7. **Account Status Checks**

```python
if not user.is_active:
    raise HTTPException(
        status_code=403,
        detail="Account is deactivated"
    )
```

**Deactivated accounts**:
- Cannot log in
- Cannot access API
- Data preserved (not deleted)
- Can be reactivated by support

---

## 🔧 Key Components Deep Dive

### 1. **app/main.py** - Application Entry Point

```python
from fastapi import FastAPI

app = FastAPI(
    title="HealthOS",
    description="Health tracking API",
    version="1.0.0"
)

# Add middleware (runs before/after each request)
app.add_middleware(CORSMiddleware, ...)
app.add_middleware(SecurityHeadersMiddleware, ...)

# Include all route modules
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
# ... more routers

# Start server with: uvicorn app.main:app --reload
```

**What it does**:
- Creates FastAPI application
- Configures middleware (CORS, security headers)
- Registers all API routes
- Sets up global exception handlers
- Initializes rate limiter

---

### 2. **app/core/config.py** - Configuration Management

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"  # Load from .env file

settings = Settings()  # Create single instance
```

**Environment Variables** (stored in `.env` file):
```
APP_NAME=HealthOS
DATABASE_URL=postgresql://user:pass@localhost/healthos
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Why use environment variables?**
- Keep secrets out of code
- Different settings for dev/production
- Easy to change without code changes

---

### 3. **app/core/database.py** - Database Connection

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,              # Keep 10 connections ready
    max_overflow=20,           # Can create 20 more if needed
    pool_recycle=3600,         # Refresh connections every hour
    pool_pre_ping=True,        # Check connection before using
)

# Create session factory
SessionLocal = sessionmaker(bind=engine)

# Dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db  # Provide database session
    finally:
        db.close()  # Always close after use
```

**Connection Pooling**:
- Reuses database connections (faster than creating new ones)
- pool_size: Number of permanent connections
- max_overflow: Extra connections when busy
- Automatically closes connections when done

---

### 4. **app/core/security.py** - Authentication & Security

```python
from passlib.context import CryptContext
from jose import jwt

# Password hashing
pwd_context = CryptContext(schemes=["argon2"])

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# JWT tokens
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

# Get current user from token
def get_current_user(token: str, db: Session):
    payload = jwt.decode(token, SECRET_KEY)
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(401, "Unauthorized")
    return user
```

**Authentication Flow**:
```
1. User sends login request
2. verify_password() checks if password correct
3. create_access_token() creates JWT
4. User receives token
5. User sends token with each request
6. get_current_user() verifies token and returns user
```

---

### 5. **Services Layer** - Business Logic

Services contain the actual logic, keeping endpoints clean.

**Example: food_log_service.py**:
```python
def create_food_log(db: Session, user_id: int, data: FoodLogCreate):
    # 1. Validate date not in future
    if data.date > date.today():
        raise ValidationError("Cannot log future dates")
    
    # 2. Get food item details
    food = db.query(FoodItem).filter(FoodItem.id == data.food_id).first()
    if not food:
        raise ResourceNotFoundError("Food item")
    
    # 3. Calculate nutrition based on quantity
    multiplier = data.quantity_grams / 100
    calculated_calories = food.calories_per_100g * multiplier
    calculated_protein = food.protein_per_100g * multiplier
    calculated_fat = food.fat_per_100g * multiplier
    calculated_carbs = food.carbs_per_100g * multiplier
    
    # 4. Create food log
    food_log = FoodLog(
        user_id=user_id,
        food_id=data.food_id,
        quantity_grams=data.quantity_grams,
        calculated_calories=calculated_calories,
        calculated_protein=calculated_protein,
        calculated_fat=calculated_fat,
        calculated_carbs=calculated_carbs,
        date=data.date
    )
    
    # 5. Save to database
    db.add(food_log)
    db.commit()
    db.refresh(food_log)
    
    return food_log
```

**Why use services?**
- Keeps endpoints simple
- Reusable logic
- Easy to test
- Clear separation of concerns

---

### 6. **Schemas** - Data Validation

Pydantic models define what data is valid.

```python
from pydantic import BaseModel, Field, validator

class FoodLogCreate(BaseModel):
    """Schema for creating a food log"""
    food_id: int = Field(gt=0, description="ID of food item")
    quantity_grams: float = Field(gt=0, le=5000, description="Amount in grams")
    date: date = Field(description="Date of meal")
    
    @validator('date')
    def date_not_future(cls, v):
        if v > date.today():
            raise ValueError("Date cannot be in the future")
        return v
    
    @validator('quantity_grams')
    def reasonable_portion(cls, v):
        if v > 5000:
            raise ValueError("Portion cannot exceed 5kg")
        return v

class FoodLogResponse(BaseModel):
    """Schema for returning food log data"""
    id: int
    food_name: str
    quantity_grams: float
    calculated_calories: float
    date: date
    
    class Config:
        orm_mode = True  # Allow SQLAlchemy models
```

**Two types of schemas**:
1. **Request schemas** (e.g., `FoodLogCreate`): Validate incoming data
2. **Response schemas** (e.g., `FoodLogResponse`): Format outgoing data

---

### 7. **Models** - Database Tables

SQLAlchemy models define database structure.

```python
from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.orm import relationship

class FoodLog(Base):
    __tablename__ = "food_logs"
    
    # Columns
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)
    quantity_grams = Column(Float, nullable=False)
    calculated_calories = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="food_logs")
    food = relationship("FoodItem", back_populates="food_logs")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('quantity_grams > 0', name='positive_quantity'),
        Index('idx_user_date', 'user_id', 'date'),  # Fast queries
    )
```

**Key concepts**:
- **Column**: Database field
- **ForeignKey**: Links to another table
- **relationship**: Easy access to related data
- **CheckConstraint**: Database-level validation
- **Index**: Makes queries faster

---

## 🎨 Common Patterns Used

### 1. **Dependency Injection Pattern**

```python
# Bad: Creating database connection manually
@router.get("/users")
def get_users():
    db = SessionLocal()
    users = db.query(User).all()
    db.close()
    return users

# Good: Using dependency injection
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
    # Database automatically closed by FastAPI
```

**Benefits**:
- Cleaner code
- Automatic cleanup
- Easy to test (can inject mock database)

---

### 2. **Service Layer Pattern**

```python
# Endpoint (thin)
@router.post("/food-log")
def create_food_log(
    data: FoodLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return food_log_service.create_food_log(db, current_user.id, data)

# Service (thick - contains logic)
def create_food_log(db: Session, user_id: int, data: FoodLogCreate):
    # Validation logic
    # Business logic
    # Database operations
    # Return result
```

**Benefits**:
- Endpoints stay simple
- Logic is reusable
- Easy to test business logic separately

---

### 3. **Repository Pattern** (implicit)

Services act as repositories:

```python
# Instead of writing SQL everywhere:
db.execute("SELECT * FROM users WHERE email = ?", email)

# We write Python:
user = db.query(User).filter(User.email == email).first()
```

**Benefits**:
- No SQL in application code
- Database-agnostic (can switch databases)
- SQLAlchemy handles complex queries

---

### 4. **Middleware Pattern**

Code that runs before/after every request:

```python
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    # Before request
    print(f"Request to: {request.url}")
    
    # Process request
    response = await call_next(request)
    
    # After request
    response.headers["X-Custom-Header"] = "value"
    
    return response
```

**Used for**:
- Security headers
- Logging
- Authentication
- CORS
- Rate limiting

---

### 5. **Exception Handling Pattern**

```python
# Custom exceptions
class ResourceNotFoundError(HTTPException):
    def __init__(self, resource: str):
        super().__init__(
            status_code=404,
            detail=f"{resource} not found"
        )

# Global exception handler
@app.exception_handler(ResourceNotFoundError)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": exc.detail}
    )

# Use in code
user = db.query(User).filter(User.id == user_id).first()
if not user:
    raise ResourceNotFoundError("User")
```

**Benefits**:
- Consistent error responses
- Centralized error handling
- Easy to add new error types

---

### 6. **Validation Pattern**

Multiple layers of validation:

```python
# Layer 1: Pydantic schema validation
class FoodLogCreate(BaseModel):
    quantity_grams: float = Field(gt=0, le=5000)

# Layer 2: Custom validators
@validator('date')
def date_not_future(cls, v):
    if v > date.today():
        raise ValueError("No future dates")
    return v

# Layer 3: Database constraints
__table_args__ = (
    CheckConstraint('quantity_grams > 0'),
)

# Layer 4: Business logic validation (in service)
def create_food_log(data):
    if data.quantity_grams > food.max_serving_size:
        raise ValidationError("Exceeds max serving")
```

**Defense in depth**: Multiple validation layers catch errors early

---

## 📊 How Everything Works Together

### Example: Logging a Meal

**Step-by-step flow**:

```
1. User Action
   ↓
   POST /food-log
   {
     "food_id": 123,
     "quantity_grams": 150,
     "date": "2026-03-06"
   }

2. FastAPI receives request
   ↓
   Rate limiter checks: OK (under 60/minute)
   ↓
   Pydantic validates data:
   - food_id is integer ✓
   - quantity_grams is positive ✓
   - date is not future ✓

3. Authentication
   ↓
   get_current_user() extracts token from header
   ↓
   Verifies JWT signature ✓
   ↓
   Loads user from database ✓

4. Endpoint calls service
   ↓
   food_log_service.create_food_log(db, user.id, data)

5. Service processes business logic
   ↓
   Looks up food item in database
   ↓
   Food(id=123): Chicken Breast
   - calories_per_100g: 165
   - protein_per_100g: 31
   ↓
   Calculates for 150g:
   - calories: 165 * 1.5 = 247.5
   - protein: 31 * 1.5 = 46.5
   ↓
   Creates FoodLog object
   ↓
   Saves to database

6. Response
   ↓
   Convert to JSON
   ↓
   Add security headers
   ↓
   Return to user:
   {
     "id": 456,
     "food_name": "Chicken Breast",
     "quantity_grams": 150,
     "calculated_calories": 247.5,
     "calculated_protein": 46.5,
     "date": "2026-03-06"
   }
```

---

## 🚀 How to Run the Project

### 1. **Install Dependencies**

```bash
pip install -r requirements.txt
```

This installs all packages (FastAPI, SQLAlchemy, etc.)

---

### 2. **Set Up Environment Variables**

Create `.env` file:

```env
APP_NAME=HealthOS
DATABASE_URL=postgresql://user:password@localhost:5432/healthos
SECRET_KEY=your-super-secret-key-here-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DEBUG=True
```

**Generate SECRET_KEY**:
```bash
# PowerShell (Windows)
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
($bytes | ForEach-Object { $_.ToString('x2') }) -join ''

# Linux/Mac
openssl rand -hex 32
```

---

### 3. **Set Up Database**

```bash
# Create PostgreSQL database
createdb healthos

# Or use PostgreSQL client:
psql -U postgres
CREATE DATABASE healthos;
```

---

### 4. **Run Database Migrations**

Initialize database tables:

```python
# In Python shell or script
from app.core.database import Base, engine
from app.models import *  # Import all models

Base.metadata.create_all(bind=engine)
```

This creates all tables in the database.

---

### 5. **Seed Initial Data** (Optional)

```bash
python -m app.seeds.exercise_seed
```

This populates the database with common exercises.

---

### 6. **Start the Server**

```bash
uvicorn app.main:app --reload
```

**Options**:
- `--reload`: Auto-restart on code changes (development)
- `--host 0.0.0.0`: Allow external connections
- `--port 8000`: Port number (default 8000)

**Server starts at**: `http://localhost:8000`

---

### 7. **Access API Documentation**

FastAPI automatically generates interactive docs:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test endpoints directly from the browser!

---

## 🧪 Testing the API

### Using Swagger UI (Browser)

1. Go to http://localhost:8000/docs
2. Click on endpoint (e.g., POST /users/register)
3. Click "Try it out"
4. Fill in request body
5. Click "Execute"
6. View response

---

### Using cURL (Command Line)

```bash
# Register user
curl -X POST http://localhost:8000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john@example.com&password=SecurePass123!"

# Response includes access_token
# Use token in subsequent requests:

# Get profile (requires authentication)
curl -X GET http://localhost:8000/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"

# Register
response = requests.post(f"{BASE_URL}/users/register", json={
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
})
print(response.json())

# Login
response = requests.post(f"{BASE_URL}/auth/login", data={
    "username": "john@example.com",
    "password": "SecurePass123!"
})
token = response.json()["access_token"]

# Use token for authenticated requests
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/profile", headers=headers)
print(response.json())
```

---

## 🎓 Key Learnings from This Project

### 1. **RESTful API Design**
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Meaningful endpoint names
- Proper status codes (200, 201, 400, 401, 404, 500)

### 2. **Authentication & Security**
- JWT tokens for stateless authentication
- Password hashing (never store plain text!)
- Rate limiting to prevent abuse
- Security headers for protection

### 3. **Database Design**
- Proper relationships (one-to-many, one-to-one)
- Foreign keys for data integrity
- Indexes for fast queries
- Constraints for data validation

### 4. **Clean Architecture**
- Separation of concerns (models, services, endpoints)
- Reusable business logic
- Easy to test and maintain

### 5. **Validation**
- Input validation (Pydantic)
- Business logic validation (services)
- Database constraints (SQLAlchemy)

### 6. **Error Handling**
- Custom exceptions
- Global exception handlers
- Consistent error responses

### 7. **Modern Python**
- Type hints
- Async/await
- Dependency injection
- Environment variables

---

## 📚 Further Reading

Want to learn more about the technologies used?

- **FastAPI**: https://fastapi.tiangolo.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Pydantic**: https://docs.pydantic.dev/
- **JWT**: https://jwt.io/introduction
- **Argon2**: https://en.wikipedia.org/wiki/Argon2
- **REST API Design**: https://restfulapi.net/

---

## 🎯 Summary

**HealthOS** is a comprehensive health tracking API that demonstrates:

✅ **Modern Python Development**: FastAPI, async/await, type hints  
✅ **Secure Authentication**: JWT tokens, Argon2 password hashing  
✅ **Clean Architecture**: Separation of concerns, reusable services  
✅ **Data Validation**: Multiple validation layers  
✅ **Database Design**: Proper relationships and constraints  
✅ **Security Best Practices**: Rate limiting, security headers, CORS  
✅ **Production Ready**: Connection pooling, error handling, logging  

**Technologies**: FastAPI, PostgreSQL, SQLAlchemy, Pydantic, JWT, Argon2, SlowAPI

**Features**: User management, food logging, workout tracking, hydration monitoring, weight progress, habit tracking, comprehensive dashboard

---

*This documentation provides a complete overview of the HealthOS project. For specific implementation details, refer to the source code with this knowledge as your foundation.*
