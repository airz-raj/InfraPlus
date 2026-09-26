"""
Analytics API Router — GET /api/v1/analytics/hotspots

Serves a GeoJSON FeatureCollection combining:
  - Citizen complaint Interactions (with category, severity, status)
  - Planned InfrastructureProject entries (with budget, title, description)

This endpoint powers the frontend geospatial heatmap for policymakers.
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from geoalchemy2.functions import ST_AsGeoJSON, ST_X, ST_Y
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from api.schemas import HotspotFeature, HotspotFeatureProperties, HotspotGeoJSON
from core.database import get_db
from models.schema import Interaction, InteractionStatus, InfrastructureProject

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get(
    "/hotspots",
    response_model=HotspotGeoJSON,
    status_code=status.HTTP_200_OK,
    summary="Retrieve GeoJSON hotspot data",
    description=(
        "Returns a GeoJSON FeatureCollection combining citizen complaints "
        "with current infrastructure project budget data for map rendering."
    ),
)
async def get_hotspots(
    category: Optional[str] = Query(
        default=None,
        description="Filter by infrastructure category (e.g. 'water', 'electricity').",
    ),
    min_severity: Optional[int] = Query(
        default=None, ge=1, le=5,
        description="Minimum severity threshold for complaints.",
    ),
    db: AsyncSession = Depends(get_db),
) -> HotspotGeoJSON:
    """
    Query Interactions and InfrastructureProjects, convert their PostGIS
    geometries into GeoJSON features, and return a unified FeatureCollection.
    """

    features: list[HotspotFeature] = []

    # ------------------------------------------------------------------
    # 1. Fetch citizen complaints
    # ------------------------------------------------------------------
    complaint_query = select(
        Interaction.id,
        Interaction.category,
        Interaction.severity,
        Interaction.status,
        ST_AsGeoJSON(Interaction.location).label("geojson"),
    ).where(Interaction.location.isnot(None))

    if category:
        complaint_query = complaint_query.where(
            func.lower(Interaction.category) == category.lower()
        )
    if min_severity is not None:
        complaint_query = complaint_query.where(
            Interaction.severity >= min_severity
        )

    result = await db.execute(complaint_query)
    complaints = result.all()

    for row in complaints:
        try:
            import json
            geom = json.loads(row.geojson)
        except Exception:
            continue

        features.append(
            HotspotFeature(
                geometry=geom,
                properties=HotspotFeatureProperties(
                    interaction_id=row.id,
                    category=row.category or "unknown",
                    severity=row.severity,
                    status=row.status.value if row.status else None,
                    feature_type="complaint",
                ),
            )
        )

    # ------------------------------------------------------------------
    # 2. Fetch infrastructure projects
    # ------------------------------------------------------------------
    project_query = select(
        InfrastructureProject.id,
        InfrastructureProject.title,
        InfrastructureProject.description,
        InfrastructureProject.category,
        InfrastructureProject.budget,
        ST_AsGeoJSON(InfrastructureProject.location).label("geojson"),
    ).where(InfrastructureProject.location.isnot(None))

    if category:
        project_query = project_query.where(
            func.lower(InfrastructureProject.category) == category.lower()
        )

    result = await db.execute(project_query)
    projects = result.all()

    for row in projects:
        try:
            import json
            geom = json.loads(row.geojson)
        except Exception:
            continue

        features.append(
            HotspotFeature(
                geometry=geom,
                properties=HotspotFeatureProperties(
                    category=row.category or "unknown",
                    feature_type="project",
                    title=row.title,
                    budget=row.budget,
                    description=row.description,
                ),
            )
        )

    logger.info(
        "Hotspots served: %d complaints, %d projects",
        len(complaints),
        len(projects),
    )

    return HotspotGeoJSON(features=features)
