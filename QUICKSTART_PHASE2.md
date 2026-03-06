# 🚀 Quick Start - Phase 2 Features

**Complete these steps to activate the new features:**

---

## ⚡ 3-Step Setup

### Step 1: Update `.env` File (2 minutes)

Add these lines to your `.env` file:

```env
# Email Settings (Optional - skip for dev/testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
SMTP_FROM_NAME=HealthOS
FRONTEND_URL=http://localhost:3000
```

> **Note**: You can skip email setup for development. The system will work without sending actual emails.

---

### Step 2: Run Database Migration (1 minute)

Add the `role` column to your database:

```sql
-- Copy and paste this into your database client
ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';
CREATE INDEX idx_users_role ON users(role);
```

Or run the migration file:
```bash
sqlite3 health_os.db < migration_add_role.sql
```

---

### Step 3: Create an Admin User (30 seconds)

Promote yourself to admin:

```sql
-- Replace with your actual email
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## ✅ Verify It Works

### 1. Restart Server
```bash
uvicorn app.main:app --reload
```

### 2. Test Registration
```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

Check response includes `"role": "user"`

### 3. Test Admin Access
```bash
# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=your-email@example.com&password=YourPassword123!"

# Access admin endpoint (use token from login)
curl -X POST "http://localhost:8000/admin/reseed-database" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Should work if you're an admin! ✅

---

## 🎯 What's New?

### 1️⃣ Email Verification
- Users get verification email after registration
- Endpoint: `POST /users/verify-email`
- Token expires in 24 hours

### 2️⃣ Password Reset
- Users can reset forgotten passwords
- Endpoints:
  - `POST /auth/forgot-password` - Request reset
  - `POST /auth/reset-password` - Reset with token
- Token expires in 1 hour

### 3️⃣ User Roles
- Three roles: `user`, `admin`, `premium`
- Admin endpoints now protected
- Role shown in all user responses

---

## 📖 Full Documentation

- **Email Setup**: [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)
- **Role System**: [ROLE_SYSTEM_GUIDE.md](ROLE_SYSTEM_GUIDE.md)
- **Complete Summary**: [PHASE2_SUMMARY.md](PHASE2_SUMMARY.md)

---

## 🐛 Troubleshooting

### "Column role already exists"
✅ Already migrated! Skip step 2.

### "Access denied. Admin role required"
❌ User not admin. Run step 3 again with correct email.

### "SMTP not configured"
✅ Normal in dev mode. Emails won't send but features work.

### Token expired
❌ Request new verification/reset email.

---

## 🎉 You're All Set!

All 8 bugs from Phase 1 & 2 are now fixed! 🚀
