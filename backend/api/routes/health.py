"""
Health check router — GET /api/v1/health

Provides a lightweight liveness probe for infrastructure monitoring,
load balancers, and container orchestration health checks.
"""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, status

router = APIRouter(prefix="/api/v1", tags=["Health"])


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="API health check",
)
async def health_check() -> dict:
    """Return API liveness status and current server timestamp."""
    return {
        "status": "healthy",
        "service": "InfraPulse API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
