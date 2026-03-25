# HealthOS

HealthOS is a full-stack health tracking platform with a FastAPI backend and a React + Vite frontend.

It helps users track:
- nutrition and food logs
- hydration
- workouts and calories burned
- weight progress
- habits and consistency
- dashboard analytics

## Architecture

### Backend service
- Stack: FastAPI, SQLAlchemy, Pydantic, JWT, SlowAPI rate limiting
- Location: `backend/`
- Entry point: `backend/app/main.py`
- Default URL: `http://localhost:8000`
- API prefix: `/api/v1`

### Frontend service
- Stack: React, Vite, Tailwind, React Query, Axios, Zustand
- Location: `frontend/`
- Default URL: `http://localhost:5173`
- API base URL config: `VITE_API_URL` (defaults to `http://localhost:8000/api/v1`)

## Repository layout

```text
HealthOS/
  backend/
    app/
      main.py
      api/
      core/
      models/
      schemas/
      services/
    .env
    healthos.db
  frontend/
    src/
    package.json
  .env.example
  requirements.txt
  package.json
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

## Quick start

### 1) Clone and enter project

```bash
git clone https://github.com/yourusername/HealthOS.git
cd HealthOS
```

### 2) Backend setup

Create and activate a virtual environment:

```bash
python -m venv venv
# Windows PowerShell
venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create backend environment file:

```bash
copy .env.example backend\.env
```

Edit `backend/.env` and set real values for:
- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- token settings and optional SMTP / Google OAuth settings

Generate a secure secret key:

```bash
openssl rand -hex 32
```

Run backend:

```bash
cd backend
uvicorn app.main:app --reload
```

Backend URLs:
- API root: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`

### 3) Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
- App: `http://localhost:5173`

If needed, create `frontend/.env` and set:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Running both services from root

Install frontend dependencies once:

```bash
cd frontend
npm install
cd ..
```

From project root, run frontend via workspace scripts:

```bash
npm run dev
```

Run backend in a second terminal:

```bash
cd backend
uvicorn app.main:app --reload
```

## Environment configuration

Main environment file:
- `backend/.env`

Template:
- `.env.example`

Important keys used by backend:
- `APP_NAME`
- `DEBUG`
- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `REFRESH_TOKEN_EXPIRE_DAYS`
- `CORS_ORIGINS`
- `RATE_LIMIT_PER_MINUTE`
- `SMTP_*`
- `FRONTEND_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

## Available scripts

### Root
- `npm run dev` -> runs frontend dev server
- `npm run build` -> builds frontend
- `npm run preview` -> previews frontend build

### Frontend (`frontend/package.json`)
- `npm run dev`
- `npm run build`
- `npm run preview`

### Backend
- Dev server: `uvicorn app.main:app --reload`

## Backend API coverage

Implemented modules include:
- authentication and token refresh
- users and profile
- food logs and nutrition analysis
- hydration logs
- workouts and exercises
- weight progress and consistency
- habit tracking
- dashboard aggregation

All endpoints are under `/api/v1`.

## Security highlights

- JWT access + refresh token flow
- Argon2 password hashing
- request rate limiting by endpoint
- validation with Pydantic schemas and service-layer checks
- CORS and basic security headers middleware

## Development notes

- Canonical backend environment location: `backend/.env`
- Canonical SQLite location (if used): `backend/healthos.db`
- Keep backend and frontend running together for full functionality

## Troubleshooting

- Frontend cannot reach API:
  - ensure backend is running on `http://localhost:8000`
  - check `VITE_API_URL` value
- CORS errors:
  - update `CORS_ORIGINS` in `backend/.env`
- Auth issues after long idle time:
  - sign in again if refresh token has expired

## License

MIT