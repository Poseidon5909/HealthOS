-- Migration: Add role column to users table and update schema
-- Run this SQL against your database to add role support

-- Step 1: Add role column to users table with default value
ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

-- Step 2: Create index on role for faster queries
CREATE INDEX idx_users_role ON users(role);

-- Step 3: Optionally set an existing user as admin (update the email)
-- UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Notes:
-- - All existing users will have role = 'user' by default
-- - Valid roles: 'user', 'admin', 'premium' (for future use)
-- - You should manually promote at least one user to admin for testing
-- - Role is required and cannot be NULL

-- To verify the migration:
-- SELECT id, name, email, role FROM users;
