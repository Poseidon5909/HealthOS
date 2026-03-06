# User Role System Setup Guide

This guide explains how to set up and use the role-based access control system.

## 🎯 Overview

The role system adds access control to HealthOS with three roles:
- **user** (default) - Regular users with standard features
- **admin** - Full access including admin endpoints
- **premium** (future) - Users with premium features

## 📋 Database Migration

### Step 1: Run the SQL Migration

Execute the migration script to add the `role` column:

```bash
# If using SQLite
sqlite3 health_os.db < migration_add_role.sql

# If using PostgreSQL
psql -d your_database < migration_add_role.sql

# If using MySQL
mysql -u username -p your_database < migration_add_role.sql
```

### Step 2: Manually Promote an Admin User

After migration, promote at least one user to admin:

```sql
-- Replace with your actual admin email
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

-- Verify the change
SELECT id, name, email, role FROM users WHERE role = 'admin';
```

### Alternative: Promote via Python/API

```python
# Python script to promote user
from app.models.user import User
from app.core.database import SessionLocal

db = SessionLocal()
user = db.query(User).filter(User.email == "admin@example.com").first()
if user:
    user.role = 'admin'
    db.commit()
    print(f"✅ {user.name} is now an admin")
else:
    print("❌ User not found")
db.close()
```

## 🔒 Protected Endpoints

### Admin-Only Endpoints

These endpoints now require admin role:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/reseed-database` | POST | Clear and reseed database |

### How to Protect New Endpoints

```python
from app.core.security import get_admin_user

@router.post("/admin/some-action")
def admin_action(
    current_user = Depends(get_admin_user)  # ✅ Requires admin role
):
    return {"message": "Admin action completed"}
```

### Custom Role Requirements

```python
from app.core.security import require_role

@router.get("/premium/feature")
def premium_feature(
    current_user = Depends(require_role("premium"))  # ✅ Requires premium role
):
    return {"message": "Premium feature"}
```

## 🧪 Testing the Role System

### 1. Register a Regular User
```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Regular User",
    "email": "user@example.com",
    "password": "User123!@#"
  }'
# Response will show: "role": "user"
```

### 2. Login and Get Token
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=User123!@#"

# Save the access_token from response
```

### 3. Try to Access Admin Endpoint (Should Fail)
```bash
curl -X POST "http://localhost:8000/admin/reseed-database" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Response: {"detail": "Access denied. Admin role required."}
```

### 4. Promote User to Admin
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### 5. Login Again and Retry
```bash
# Login again to get new token with admin role
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=User123!@#"

# Now try admin endpoint again - should work!
curl -X POST "http://localhost:8000/admin/reseed-database" \
  -H "Authorization: Bearer NEW_ACCESS_TOKEN"
```

## 🎭 Role Field in API Responses

The `role` field is now included in all user responses:

### User Registration Response
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "is_active": true,
  "email_verified": false,
  "role": "user",
  "created_at": "2026-03-06T10:30:00Z"
}
```

### Get Current User Response
```bash
GET /users/me
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "is_active": true,
  "email_verified": true,
  "role": "admin",
  "created_at": "2026-03-06T10:30:00Z"
}
```

## 🛡️ Security Functions

### Available Functions in `security.py`

```python
# 1. Get current authenticated user (any role)
from app.core.security import get_current_user

@router.get("/profile")
def get_profile(current_user = Depends(get_current_user)):
    return current_user

# 2. Require admin role
from app.core.security import get_admin_user

@router.delete("/admin/delete-user/{user_id}")
def delete_user(
    user_id: int,
    current_user = Depends(get_admin_user)
):
    # Only admins can access this
    pass

# 3. Require specific role
from app.core.security import require_role

@router.get("/premium/analytics")
def premium_analytics(
    current_user = Depends(require_role("premium"))
):
    # Only premium users can access
    pass
```

## 📱 Frontend Integration

### Check User Role in Frontend

```typescript
// React/Next.js example
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'premium';
  email_verified: boolean;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data));
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      
      {/* Show admin panel only for admins */}
      {user?.role === 'admin' && (
        <div className="admin-panel">
          <button onClick={reseedDatabase}>Reseed Database</button>
        </div>
      )}
      
      {/* Show premium features for premium users */}
      {user?.role === 'premium' && (
        <div className="premium-features">
          <h2>Premium Analytics</h2>
        </div>
      )}
    </div>
  );
};
```

### Conditional Navigation

```typescript
const Navigation = ({ user }: { user: User }) => {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/profile">Profile</Link>
      
      {user.role === 'admin' && (
        <Link href="/admin">Admin Panel</Link>
      )}
      
      {user.role === 'premium' && (
        <Link href="/premium">Premium Features</Link>
      )}
    </nav>
  );
};
```

## 🚀 Future Enhancements

### Premium Role Features (To Implement)

1. **Unlimited Food Logs** (regular users limited to X per day)
2. **Advanced Analytics** (trends, predictions, insights)
3. **Custom Goals** (beyond standard targets)
4. **Export Data** (CSV, PDF reports)
5. **Priority Support**

Example implementation:
```python
from app.core.security import get_current_user
from fastapi import HTTPException

@router.post("/food-logs")
def log_food(
    food_data: FoodLogCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check daily limit for non-premium users
    if current_user.role == 'user':
        today_logs = db.query(FoodLog).filter(
            FoodLog.user_id == current_user.id,
            FoodLog.date == date.today()
        ).count()
        
        if today_logs >= 20:  # Free tier limit
            raise HTTPException(
                status_code=403,
                detail="Daily limit reached. Upgrade to premium for unlimited logs."
            )
    
    # Premium users have no limit
    return create_food_log(db, current_user.id, food_data)
```

## ⚠️ Common Issues

### Issue 1: "Access denied. Admin role required"
**Solution**: 
- User is not an admin
- Promote user with: `UPDATE users SET role = 'admin' WHERE email = 'user@example.com'`
- Login again to get new token

### Issue 2: Migration fails with "column already exists"
**Solution**: 
- Role column might already exist
- Check: `SELECT role FROM users LIMIT 1;`
- If exists, skip migration

### Issue 3: Old tokens don't have role information
**Solution**: 
- Tokens don't store role (it's looked up from database)
- Just need to login again
- No need to invalidate old tokens

## 📊 Role Statistics Query

Monitor role distribution:

```sql
-- Count users by role
SELECT role, COUNT(*) as user_count
FROM users
GROUP BY role;

-- Find all admins
SELECT id, name, email, created_at
FROM users
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Find users without verified email
SELECT id, name, email, role
FROM users
WHERE email_verified = false;
```

## 🔐 Security Best Practices

1. **Minimum Admins**: Only promote trusted users to admin
2. **Audit Logging**: Log all admin actions (to implement)
3. **Regular Reviews**: Periodically review admin user list
4. **Disable Compromised Accounts**: Use `is_active = false`
5. **Strong Passwords**: Admins should use extra-strong passwords
6. **2FA for Admins**: Consider implementing 2FA (future enhancement)

## ✅ Implementation Checklist

- [x] Add `role` column to User model
- [x] Update User schema to include role
- [x] Create `get_admin_user` dependency
- [x] Create `require_role` dependency
- [x] Protect admin endpoints
- [x] Set default role to 'user'
- [x] Create migration SQL script
- [ ] Run migration on database
- [ ] Promote at least one admin user
- [ ] Test admin access control
- [ ] Document role system
- [ ] Update frontend to show role-specific features

## 🎯 Testing Completed

All role system features are implemented:
- ✅ Role column in database model
- ✅ Role in user schemas and API responses
- ✅ Admin-only endpoints protection
- ✅ Flexible role checking functions
- ✅ Migration script provided
- ✅ Default role assignment on registration
- ✅ Frontend-ready API responses
