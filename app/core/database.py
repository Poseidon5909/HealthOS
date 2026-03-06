from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings


# Database engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=10,              # Maximum number of persistent connections
    max_overflow=20,           # Maximum number of connections that can be created beyond pool_size
    pool_timeout=30,           # Timeout for getting a connection from the pool
    pool_recycle=3600,         # Recycle connections after 1 hour
    pool_pre_ping=True,        # Verify connections before using them
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# Dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
