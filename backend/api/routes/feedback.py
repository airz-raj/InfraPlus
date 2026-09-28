from fastapi import APIRouter, File, UploadFile, Form, status
from pydantic import BaseModel
import logging

from core.store import db_store, InteractionStatus
from services.ai_pipeline import process_audio_interaction, process_text_interaction

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/feedback", tags=["Feedback"])

class TextFeedbackRequest(BaseModel):
    text: str
    lat: float
    lng: float

class FeedbackResponse(BaseModel):
    message: str
    interaction_id: int
    status: str
    category: str
    severity: int

@router.post("/text", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_text_feedback(request: TextFeedbackRequest):
    ai_result = await process_text_interaction(request.text)
    
    interaction = db_store.add_interaction({
        "media_type": "text",
        "raw_intent": ai_result.get("intent", request.text),
        "category": ai_result.get("category", "unknown"),
        "severity": ai_result.get("severity", 1),
        "status": InteractionStatus.PENDING,
        "lng": request.lng,
        "lat": request.lat
    })
    
    return FeedbackResponse(
        message="Feedback logged successfully",
        interaction_id=interaction.id,
        status=interaction.status.value,
        category=interaction.category,
        severity=interaction.severity
    )

@router.post("/audio", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_audio_feedback(
    audio: UploadFile = File(...),
    lat: float = Form(...),
    lng: float = Form(...)
):
    # Skip actual ffmpeg conversion and use the AI simulated response directly
    ai_result = await process_audio_interaction(audio.filename)
    
    interaction = db_store.add_interaction({
        "media_type": "audio",
        "raw_intent": ai_result.get("intent", "Audio complaint"),
        "category": ai_result.get("category", "unknown"),
        "severity": ai_result.get("severity", 1),
        "status": InteractionStatus.PENDING,
        "lng": lng,
        "lat": lat
    })

    return FeedbackResponse(
        message="Audio feedback logged successfully",
        interaction_id=interaction.id,
        status=interaction.status.value,
        category=interaction.category,
        severity=interaction.severity
    )
