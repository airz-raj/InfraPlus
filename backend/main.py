"""
InfraPulse API — FastAPI Application Entry Point

Initializes the FastAPI app with CORS middleware, global exception handling,
startup/shutdown lifecycle hooks, and mounts all v1 API routers.

Run with:
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from __future__ import annotations

import logging
import sys

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import settings
from core.database import engine, Base

# ---- Router imports --------------------------------------------------------
from api.routes.feedback import router as feedback_router
from api.routes.analytics import router as analytics_router
from api.routes.health import router as health_router

# ---- Logging ---------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)

# ---- FastAPI App -----------------------------------------------------------
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.3.0",
    description=(
        "InfraPulse API — A BRICS DPI Feedback-to-Funding platform. "
        "Collects citizen feedback (voice/text), extracts infrastructure "
        "intents via an AI pipeline, and serves analytics to policymakers."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---- CORS Middleware -------------------------------------------------------
# Allow all origins during development; restrict in production via env vars.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Global Exception Handler ---------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all exception handler.  Logs the full traceback and returns a
    generic 500 response so the citizen never sees raw Python errors.
    """
    logger.error(
        "Unhandled exception on %s %s: %s",
        request.method,
        request.url.path,
        exc,
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal error occurred. The team has been notified.",
            "status_code": 500,
        },
    )


# ---- Lifecycle Events ------------------------------------------------------
@app.on_event("startup")
async def on_startup() -> None:
    """Create all database tables on first run (idempotent)."""
    logger.info("Starting InfraPulse API v0.3.0 …")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables ensured.")
    
    try:
        from seed import seed_database
        await seed_database()
    except Exception as e:
        logger.error(f"Failed to seed database: {e}")


@app.on_event("shutdown")
async def on_shutdown() -> None:
    """Dispose of the async engine connection pool."""
    logger.info("Shutting down InfraPulse API …")
    await engine.dispose()


# ---- Register Routers ------------------------------------------------------
app.include_router(health_router)
app.include_router(feedback_router)
app.include_router(analytics_router)


# ---- Root Redirect ---------------------------------------------------------
@app.get("/", include_in_schema=False)
async def root():
    """Redirect bare root to the interactive API docs."""
    return {
        "message": "Welcome to InfraPulse API",
        "docs": "/docs",
        "health": "/api/v1/health",
    }
