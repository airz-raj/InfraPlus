import json
import logging
import os
from typing import Dict, Any

try:
    from google import genai
except ImportError:
    genai = None

logger = logging.getLogger(__name__)

async def process_text_interaction(text: str) -> Dict[str, Any]:
    """
    Uses the official google-genai SDK to extract intent, category, location, and severity.
    Falls back to mock data if GEMINI_API_KEY is not set.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or not genai:
        logger.warning("GEMINI_API_KEY not set or google-genai not installed. Using mock intent extraction.")
        return {
            "intent": "problem",
            "category": "water",
            "location": "0,0",
            "severity": 4,
            "raw_text": text
        }
        
    try:
        client = genai.Client(api_key=api_key)
        prompt = f"""
        Extract the intent, category (water, electricity, roads, transport, sanitation), location (as lat,lng string if possible, or 0,0), and severity (1-5) from the following citizen complaint.
        Return strictly in JSON format like {{"intent": "problem", "category": "water", "location": "12.9,77.5", "severity": 4}}.
        
        Text: {text}
        """
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        res_text = response.text.strip()
        if res_text.startswith("```json"):
            res_text = res_text[7:-3]
        elif res_text.startswith("```"):
            res_text = res_text[3:-3]
            
        return json.loads(res_text.strip())
    except Exception as e:
        logger.error(f"Gemini API extraction failed: {e}")
        return {
            "intent": "unknown",
            "category": "unknown",
            "location": "0,0",
            "severity": 1,
            "raw_text": text
        }

async def process_audio_interaction(audio_file_path: str) -> Dict[str, Any]:
    """
    Simulates STT transcription then utilizes Gemini for intent extraction.
    """
    simulated_transcription = "There is a massive pothole causing accidents on the main road."
    return await process_text_interaction(simulated_transcription)
