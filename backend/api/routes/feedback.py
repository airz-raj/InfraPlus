"""
Feedback API Router — POST /api/v1/feedback

Accepts citizen feedback as either:
  - multipart/form-data with an audio file attachment, or
  - JSON body with plain-text feedback.

Orchestrates the audio normalization → STT → NLP pipeline for audio,
or directly runs NLP extraction for text. Persists results to the
Interaction table with geospatial location data.
"""

from __future__ import annotations

import logging
import os
import tempfile
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.schemas import FeedbackResponse, TextFeedbackRequest
from core.database import get_db
from models.schema import Interaction, InteractionStatus
from services.ai_pipeline import process_audio_interaction, process_text_interaction
from services.audio_service import normalize_audio

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Feedback"])

# Directory for temporary audio file storage during processing
UPLOAD_DIR = os.path.join(tempfile.gettempdir(), "infrapulse_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _parse_location(location_str: str) -> tuple[float, float]:
    """Parse a 'lat,lng' string into a (latitude, longitude) tuple."""
    try:
        parts = location_str.split(",")
        return float(parts[0].strip()), float(parts[1].strip())
    except (IndexError, ValueError):
        return 0.0, 0.0


# ---------------------------------------------------------------------------
# POST /api/v1/feedback  (multipart — audio upload)
# ---------------------------------------------------------------------------
@router.post(
    "/feedback",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit citizen feedback (audio or text)",
    description=(
        "Accepts citizen feedback as either an audio file upload "
        "(multipart/form-data) or a JSON text body."
    ),
)
async def submit_feedback_audio(
    audio_file: UploadFile = File(None),
    text: Optional[str] = Form(None),
    user_id: Optional[int] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    db: AsyncSession = Depends(get_db),
) -> FeedbackResponse:
    """
    Unified feedback endpoint that handles both audio and text submissions
    via multipart/form-data.  If an ``audio_file`` is provided it takes
    priority; otherwise ``text`` is used.
    """

    # ---- Audio path --------------------------------------------------------
    if audio_file is not None and audio_file.filename:
        return await _handle_audio_feedback(
            audio_file=audio_file,
            user_id=user_id,
            latitude=latitude,
            longitude=longitude,
            db=db,
        )

    # ---- Text path ---------------------------------------------------------
    if text:
        return await _handle_text_feedback(
            text=text,
            user_id=user_id,
            latitude=latitude,
            longitude=longitude,
            db=db,
        )

    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Either 'audio_file' or 'text' must be provided.",
    )


# ---------------------------------------------------------------------------
# POST /api/v1/feedback/text  (JSON — text-only convenience route)
# ---------------------------------------------------------------------------
@router.post(
    "/feedback/text",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit text feedback via JSON body",
)
async def submit_feedback_text(
    body: TextFeedbackRequest,
    db: AsyncSession = Depends(get_db),
) -> FeedbackResponse:
    """Convenience endpoint accepting a JSON body for text-only feedback."""
    return await _handle_text_feedback(
        text=body.text,
        user_id=body.user_id,
        latitude=body.latitude,
        longitude=body.longitude,
        db=db,
    )


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

async def _handle_audio_feedback(
    audio_file: UploadFile,
    user_id: Optional[int],
    latitude: Optional[float],
    longitude: Optional[float],
    db: AsyncSession,
) -> FeedbackResponse:
    """Process an uploaded audio file through the full AI pipeline."""

    unique_id = uuid.uuid4().hex
    raw_path = os.path.join(UPLOAD_DIR, f"{unique_id}_raw_{audio_file.filename}")
    normalized_path = os.path.join(UPLOAD_DIR, f"{unique_id}_normalized.wav")

    try:
        # 1. Persist uploaded bytes to disk
        content = await audio_file.read()
        with open(raw_path, "wb") as f:
            f.write(content)

        # 2. Normalize to 16 kHz mono WAV
        await normalize_audio(raw_path, normalized_path)

        # 3. Run STT + NLP pipeline
        intent_data = await process_audio_interaction(normalized_path)

    except Exception as exc:
        logger.error("Audio processing failed: %s", exc, exc_info=True)
        # Graceful degradation — save as REVIEW_REQUIRED
        intent_data = {
            "intent": "unknown",
            "category": "unknown",
            "location": "0,0",
            "severity": 1,
        }

    finally:
        # 4. Clean up temporary files
        for path in (raw_path, normalized_path):
            if os.path.exists(path):
                try:
                    os.remove(path)
                except OSError:
                    pass

    return await _persist_interaction(
        intent_data=intent_data,
        media_type="audio",
        media_ref=audio_file.filename or "uploaded_audio",
        raw_intent=intent_data.get("raw_text"),
        user_id=user_id,
        latitude=latitude,
        longitude=longitude,
        db=db,
    )


async def _handle_text_feedback(
    text: str,
    user_id: Optional[int],
    latitude: Optional[float],
    longitude: Optional[float],
    db: AsyncSession,
) -> FeedbackResponse:
    """Process a plain-text feedback submission through the NLP pipeline."""

    try:
        intent_data = await process_text_interaction(text)
    except Exception as exc:
        logger.error("Text NLP processing failed: %s", exc, exc_info=True)
        intent_data = {
            "intent": "unknown",
            "category": "unknown",
            "location": "0,0",
            "severity": 1,
        }

    return await _persist_interaction(
        intent_data=intent_data,
        media_type="text",
        media_ref=None,
        raw_intent=text,
        user_id=user_id,
        latitude=latitude,
        longitude=longitude,
        db=db,
    )


async def _persist_interaction(
    *,
    intent_data: dict,
    media_type: str,
    media_ref: Optional[str],
    raw_intent: Optional[str],
    user_id: Optional[int],
    latitude: Optional[float],
    longitude: Optional[float],
    db: AsyncSession,
) -> FeedbackResponse:
    """Create an Interaction row and return the response schema."""

    # Resolve location: prefer explicit lat/lng params, then AI-extracted
    lat, lng = latitude, longitude
    if lat is None or lng is None:
        extracted = intent_data.get("location", "0,0")
        lat, lng = _parse_location(extracted)

    # Build WKT for PostGIS POINT (note: PostGIS uses POINT(lng lat))
    wkt_point = f"SRID=4326;POINT({lng} {lat})"

    # Determine processing status
    category = intent_data.get("category", "unknown")
    processing_status = (
        InteractionStatus.REVIEW_REQUIRED
        if category == "unknown"
        else InteractionStatus.PROCESSED
    )

    interaction = Interaction(
        user_id=user_id,
        media_type=media_type,
        media_ref=media_ref,
        raw_intent=raw_intent,
        category=category,
        severity=intent_data.get("severity", 1),
        status=processing_status,
        location=wkt_point,
    )

    db.add(interaction)
    await db.commit()
    await db.refresh(interaction)

    return FeedbackResponse(
        id=interaction.id,
        media_type=interaction.media_type,
        category=interaction.category,
        severity=interaction.severity,
        status=interaction.status.value if interaction.status else "PENDING",
        raw_intent=interaction.raw_intent,
        created_at=interaction.created_at,
    )
