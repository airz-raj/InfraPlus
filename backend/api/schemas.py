"""
Pydantic v2 schemas for API request/response validation.
Defines strictly typed contracts for the InfraPulse REST API.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# Feedback endpoint schemas
# ---------------------------------------------------------------------------

class TextFeedbackRequest(BaseModel):
    """Schema for submitting feedback via plain text (JSON body)."""

    text: str = Field(
        ...,
        min_length=5,
        max_length=5000,
        description="The citizen's feedback text describing an infrastructure issue.",
    )
    user_id: Optional[int] = Field(
        default=None,
        description="Optional user ID if the citizen is registered.",
    )
    latitude: Optional[float] = Field(
        default=None, ge=-90, le=90,
        description="Latitude of the reported issue location.",
    )
    longitude: Optional[float] = Field(
        default=None, ge=-180, le=180,
        description="Longitude of the reported issue location.",
    )


class FeedbackResponse(BaseModel):
    """Unified response returned after processing any feedback submission."""

    id: int = Field(..., description="Database ID of the created interaction.")
    media_type: str = Field(..., description="'text' or 'audio'.")
    category: str = Field(..., description="Extracted infrastructure category.")
    severity: int = Field(..., ge=1, le=5, description="Severity score (1-5).")
    status: str = Field(..., description="Processing status of the interaction.")
    raw_intent: Optional[str] = Field(
        default=None,
        description="Transcription or original text stored for auditing.",
    )
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Analytics / Hotspot endpoint schemas
# ---------------------------------------------------------------------------

class HotspotFeatureProperties(BaseModel):
    """Properties block inside a single GeoJSON Feature."""

    interaction_id: Optional[int] = None
    category: str
    severity: Optional[int] = None
    status: Optional[str] = None
    feature_type: str = Field(
        ...,
        description="Discriminator: 'complaint' or 'project'.",
    )
    title: Optional[str] = None
    budget: Optional[float] = None
    description: Optional[str] = None


class HotspotFeature(BaseModel):
    """A single GeoJSON Feature representing a complaint or project."""

    type: str = "Feature"
    geometry: dict = Field(
        ...,
        description="GeoJSON geometry object, e.g. {'type': 'Point', 'coordinates': [lng, lat]}.",
    )
    properties: HotspotFeatureProperties


class HotspotGeoJSON(BaseModel):
    """GeoJSON FeatureCollection combining citizen complaints with infrastructure projects."""

    type: str = "FeatureCollection"
    features: list[HotspotFeature] = []


# ---------------------------------------------------------------------------
# Generic error response
# ---------------------------------------------------------------------------

class ErrorResponse(BaseModel):
    """Standard error payload returned on processing failures."""

    detail: str
    status_code: int = 500
