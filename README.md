# HealthOS

A comprehensive health tracking API built with FastAPI, featuring food logging, workout tracking, hydration monitoring, weight progress, and habit tracking.

## 🚀 Features

- **User Management**: Registration, authentication, profile management, account deactivation
- **Food Tracking**: Log meals, track calories and macronutrients, search food database
- **Workout Logging**: Track exercises, calculate calories burned, view workout history
- **Hydration Monitoring**: Log water intake, view daily hydration progress
- **Weight Progress**: Track weight changes, view trends and consistency
- **Habit Tracking**: Monitor daily habits, track streaks and completion rates
- **Dashboard**: Comprehensive overview of all health metrics

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Access tokens**: Short-lived (30 minutes) for API requests
- **Refresh tokens**: Long-lived (7 days) for obtaining new access tokens
- **Token type validation**: Ensures correct token usage across endpoints
- **Argon2** password hashing (industry-standard, memory-hard algorithm)
- **Password strength validation**: Requires 8+ characters, uppercase, lowercase, digit, special character

### Rate Limiting
Prevents abuse and brute force attacks:
- **Login**: 5 attempts/minute
- **Token refresh**: 10 attempts/minute
- **User registration**: 3 registrations/hour
- **Password change**: 5 attempts/hour
- **Account deactivation**: 2 attempts/day
- **Account deletion**: 1 attempt/day
- **General endpoints**: 60 requests/minute

### Security Headers
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block
- **Strict-Transport-Security**: max-age=31536000; includeSubDomains

### CORS
- Configurable allowed origins (defaults to localhost:3000, localhost:8000)
- Credentials support enabled
- All methods and headers allowed for development

### Data Validation
- **Pydantic schemas** with comprehensive Field constraints
- **Business logic validation** in service layer
- **Realistic constraints**: Weight 20-500kg, calories max 10k, water max 5L, workout max 12hrs
- **Future date prevention** for historical data
- **Email uniqueness** enforcement
- **Account status checks**: Deactivated users cannot authenticate

## 🛠️ Tech Stack

- **FastAPI** 0.129.0 - Modern web framework
- **SQLAlchemy** 2.0.46 - ORM
- **PostgreSQL** - Database (via psycopg2-binary)
- **Pydantic** 2.12.5 - Data validation
- **python-jose** - JWT token handling
- **argon2-cffi** 23.1.0 - Password hashing
- **slowapi** 0.1.9 - Rate limiting
- **passlib** - Password utilities
- **Uvicorn** - ASGI server

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/HealthOS.git
cd HealthOS
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Generate a secure SECRET_KEY:
```bash
openssl rand -hex 32
```

6. Run the application:
```bash
uvicorn app.main:app --reload
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password (returns access + refresh tokens)
- `POST /auth/refresh` - Refresh access token using refresh token
- `GET /auth/protected` - Example protected endpoint

### User Management
- `POST /users/` - Register new user
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update profile (name/email)
- `POST /users/me/change-password` - Change password
- `POST /users/me/verify-email` - Verify email address
- `POST /users/me/deactivate` - Deactivate account (soft delete)
- `DELETE /users/me` - Delete account permanently

### Food Tracking
- `POST /food-logs/` - Log food consumption
- `GET /food-logs/history` - Get food log history (with date filters & pagination)
- `GET /food-logs/{id}` - Get specific food log
- `PUT /food-logs/{id}` - Update food log
- `DELETE /food-logs/{id}` - Delete food log
- `GET /foods/` - Search food database
- `GET /nutrition/analysis` - Get nutrition analysis

### Workout Tracking
- `POST /workouts/` - Log workout
- `GET /workouts/history` - Get workout history (with filters)
- `GET /workouts/{id}` - Get specific workout
- `PUT /workouts/{id}` - Update workout
- `DELETE /workouts/{id}` - Delete workout
- `GET /exercises/` - Search exercise database

### Hydration
- `POST /hydration/` - Log water intake
- `GET /hydration/summary` - Daily hydration summary
- `GET /hydration/history` - Hydration history
- `DELETE /hydration/{id}` - Delete water log

### Progress Tracking
- `POST /progress/weight` - Log weight
- `GET /progress/weight` - Get weight history
- `GET /progress/consistency` - Get consistency metrics
- `PUT /progress/weight/{id}` - Update weight log
- `DELETE /progress/weight/{id}` - Delete weight log

### Habits
- `POST /habits/` - Log habit completion
- `GET /habits/status` - Get habit status
- `GET /habits/streaks` - Get habit streaks

### Dashboard
- `GET /dashboard/` - Get comprehensive health dashboard

## 📊 Token Usage

### Login Flow
```bash
# 1. Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePass123!"

# Response:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 30
}

# 2. Use access token for API requests
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: Bearer eyJ..."

# 3. Refresh token when access token expires
curl -X POST "http://localhost:8000/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "eyJ..."}'
```

## 🔧 Configuration

Key environment variables in `.env`:

```env
# Token expiration
ACCESS_TOKEN_EXPIRE_MINUTES=30  # Short-lived access tokens
REFRESH_TOKEN_EXPIRE_DAYS=7     # Long-lived refresh tokens

# Rate limiting
RATE_LIMIT_PER_MINUTE=60

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]
```

## 🛡️ Best Practices

1. **Never commit .env** - Contains sensitive credentials
2. **Use refresh tokens** - Reduces authentication overhead
3. **Rotate secrets regularly** - Generate new SECRET_KEY periodically
4. **Monitor rate limits** - Adjust based on legitimate usage patterns
5. **Use HTTPS in production** - Never send tokens over unencrypted connections
6. **Validate all inputs** - Trust nothing from client
7. **Log security events** - Track failed login attempts, token refresh patterns

## 📝 Development

### Database Migration
```bash
# Create tables
python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Running Tests
```bash
pytest
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Your Name - [@yourhandle](https://twitter.com/yourhandle)

Project Link: [https://github.com/yourusername/HealthOS](https://github.com/yourusername/HealthOS)
