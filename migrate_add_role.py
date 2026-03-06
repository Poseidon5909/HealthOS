"""
Database Migration: Add role column to users table
Run this script once to add the role column to your existing database
"""
import sqlite3
import os
from pathlib import Path

# Try to get database path from environment or use common defaults
def get_database_path():
    """Find the SQLite database file"""
    # Check common locations
    possible_paths = [
        "health_os.db",
        "app.db",
        "database.db",
        "healthos.db",
        "./health_os.db",
    ]
    
    # Check if DATABASE_URL is in environment
    db_url = os.getenv("DATABASE_URL", "")
    if "sqlite:///" in db_url:
        db_path = db_url.replace("sqlite:///", "").replace("sqlite://", "")
        possible_paths.insert(0, db_path)
    
    # Find first existing database
    for path in possible_paths:
        if Path(path).exists():
            return path
    
    return "health_os.db"  # Default

DB_PATH = get_database_path()

def add_role_column():
    """Add role column to users table"""
    try:
        # Connect to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if role column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'role' in columns:
            print("✅ Role column already exists. No migration needed.")
            conn.close()
            return
        
        print("Adding role column to users table...")
        
        # Add role column with default value
        cursor.execute("""
            ALTER TABLE users 
            ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'
        """)
        
        # Create index on role
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
        """)
        
        # Commit changes
        conn.commit()
        
        # Verify the column was added
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'role' in columns:
            print("✅ Successfully added role column to users table")
            print("✅ Created index on role column")
            
            # Count existing users
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            print(f"✅ Updated {user_count} existing user(s) with default role='user'")
        else:
            print("❌ Failed to add role column")
        
        conn.close()
        
    except sqlite3.OperationalError as e:
        if "duplicate column" in str(e).lower():
            print("✅ Role column already exists. No migration needed.")
        else:
            print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("  DATABASE MIGRATION: Add Role Column")
    print("=" * 60)
    
    # Check if database exists
    if not Path(DB_PATH).exists():
        print(f"❌ Database file not found: {DB_PATH}")
        print("Please make sure the database path is correct.")
        exit(1)
    
    print(f"Database: {DB_PATH}")
    print()
    
    add_role_column()
    
    print()
    print("=" * 60)
    print("  Migration Complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Restart your application")
    print("2. To make a user admin, run:")
    print("   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';")
    print()
