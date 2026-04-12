"""Compatibility package so `app.*` imports work from repository root.

This makes commands like `uvicorn app.main:app --reload` work when run
from the HealthOS root by forwarding package lookup to `backend/app`.
"""

from pathlib import Path

_backend_app_path = Path(__file__).resolve().parent.parent / "backend" / "app"

# Include backend/app in this package's module search path.
if _backend_app_path.exists():
    __path__.append(str(_backend_app_path))
