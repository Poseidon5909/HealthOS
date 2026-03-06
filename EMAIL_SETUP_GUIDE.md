# Email & Password Reset Setup Guide

This guide explains how to configure email verification and password reset functionality.

## 🛠️ Configuration

### Step 1: Add Email Settings to `.env`

Add these environment variables to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=HealthOS
FRONTEND_URL=http://localhost:3000
```

### Step 2: Enable Gmail App Passwords (For Gmail)

If using Gmail, you need to create an **App Password**:

1. Go to your Google Account settings
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled
4. Go to **App Passwords**
5. Generate a new app password for "Mail"
6. Copy the 16-character password
7. Use this as your `SMTP_PASSWORD` in `.env`

### Step 3: Alternative Email Providers

#### **SendGrid** (Recommended for production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### **AWS SES**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USERNAME=your-aws-access-key
SMTP_PASSWORD=your-aws-secret-key
```

#### **Outlook/Hotmail**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-outlook-password
```

## 📧 Email Features Implemented

### 1. **Email Verification**
- **Endpoint**: `POST /users/verify-email`
- **Flow**:
  1. User registers → Verification email sent automatically
  2. User clicks link in email → Gets redirected with token
  3. Frontend calls `/users/verify-email` with token
  4. Email marked as verified

### 2. **Password Reset**
- **Endpoints**:
  - `POST /auth/forgot-password` - Request reset link
  - `POST /auth/reset-password` - Reset password with token

- **Flow**:
  1. User requests password reset with email
  2. Reset link sent to email (expires in 1 hour)
  3. User clicks link → Gets token
  4. User submits new password with token
  5. Password updated, user can login

## 🧪 Testing Without Email (Development)

If you don't configure SMTP, emails won't actually be sent, but the system will still work:

- Email verification tokens are still generated
- Password reset tokens are still valid
- Console logs will show: `[EMAIL NOT SENT] SMTP not configured...`

**For testing**, you can manually verify tokens by:
1. Looking at console logs for generated tokens
2. Using the token in API requests directly

## 🔒 Security Features

### Email Verification
- Tokens expire in **24 hours**
- One-time use (checking already verified status)
- JWT-based with signature verification

### Password Reset
- Tokens expire in **1 hour** (shorter for security)
- Rate limited: 3 requests per hour per IP
- Doesn't reveal if email exists (prevents user enumeration)
- Requires active account

## 🚀 Testing the Endpoints

### 1. Register a New User
```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### 2. Verify Email (Development Mode - Get Token from Console)
```bash
curl -X POST "http://localhost:8000/users/verify-email" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### 3. Request Password Reset
```bash
curl -X POST "http://localhost:8000/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### 4. Reset Password (With Token from Email)
```bash
curl -X POST "http://localhost:8000/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "new_password": "NewPass123!@#"
  }'
```

## 📱 Frontend Integration

### Email Verification Page
```typescript
// pages/verify-email.tsx
const VerifyEmail = () => {
  const token = useSearchParams().get('token');
  
  useEffect(() => {
    if (token) {
      axios.post('/users/verify-email', { token })
        .then(() => alert('Email verified!'))
        .catch(err => alert('Verification failed'));
    }
  }, [token]);
};
```

### Password Reset Page
```typescript
// pages/reset-password.tsx
const ResetPassword = () => {
  const token = useSearchParams().get('token');
  const [password, setPassword] = useState('');
  
  const handleReset = () => {
    axios.post('/auth/reset-password', { token, new_password: password })
      .then(() => alert('Password reset! Please login'))
      .catch(err => alert('Reset failed'));
  };
};
```

## ⚠️ Common Issues

### Issue 1: "SMTP not configured"
**Solution**: Add SMTP settings to `.env` file and restart server

### Issue 2: "Invalid or expired token"
**Solution**: Token might have expired. Request a new verification/reset email

### Issue 3: Gmail "Less secure apps" error
**Solution**: Use **App Passwords** instead of your regular Gmail password

### Issue 4: Emails going to spam
**Solution**: 
- Configure SPF/DKIM records for your domain
- Use a verified email service like SendGrid
- Ask users to whitelist your email

## 🎯 Production Checklist

- [ ] Use environment variables (never hardcode credentials)
- [ ] Use a professional email service (SendGrid, AWS SES)
- [ ] Set up SPF, DKIM, and DMARC records
- [ ] Use HTTPS for all email links
- [ ] Monitor email delivery rates
- [ ] Set up email logging/tracking
- [ ] Test on multiple email clients
- [ ] Implement retry logic for failed emails

## 📊 Email Service Comparison

| Service | Free Tier | Cost | Ease of Use | Best For |
|---------|-----------|------|-------------|----------|
| Gmail SMTP | Limited | Free | Easy | Development |
| SendGrid | 100/day | $15/month | Medium | Small-Medium |
| AWS SES | 62k/month | $0.10/1000 | Hard | Large scale |
| Mailgun | 100/day | $15/month | Medium | Medium scale |

## 🔐 Security Best Practices

1. **Never log email tokens in production**
2. **Always use HTTPS for reset links**
3. **Implement rate limiting** (already done)
4. **Monitor for abuse patterns**
5. **Set short token expiry times**
6. **Invalidate old tokens after use**
7. **Don't reveal if email exists** (already implemented)

## ✅ Testing Completed Features

All features are now implemented:
- ✅ Email verification flow with JWT tokens
- ✅ Password reset with email
- ✅ Rate limiting on sensitive endpoints
- ✅ Token expiry and validation
- ✅ Security against user enumeration
- ✅ Professional HTML email templates
- ✅ Graceful fallback when SMTP not configured
