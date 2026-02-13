import json
import logging
from google.generativeai import GenerativeModel

logger = logging.getLogger(__name__)

VOICE_EXTRACTION_PROMPT = """You are a medical intake AI for Tandarust AI.

**Task:**
1. Listen to the provided audio of a doctor or patient describing symptoms.
2. Transcribe exactly what is said as a "raw_transcription".
3. Extract the following structured data if mentioned:
   - "name": Full name of the patient.
   - "age": Age of the patient as an integer.
   - "gender": Gender (Male/Female/Other).
   - "symptoms": A concise clinical summary of the symptoms described.

**Output Format:**
Respond with ONLY valid JSON. No preamble, no markdown code fences.
{
    "name": "extracted name or null",
    "age": "extracted age or null",
    "gender": "extracted gender or null",
    "symptoms": "extracted clinical symptoms",
    "raw_transcription": "the full word-for-word transcription"
}
"""

async def transcribe_audio(
    model: GenerativeModel,
    audio_bytes: bytes,
    content_type: str = "audio/wav",
) -> dict:
    """
    Send audio bytes to Gemini for structured extraction.
    Returns a dict with extracted patient data.
    """
    logger.info(f"   Model: Gemini (Audio + Structured Extraction)")
    # Normalize MIME Type
    normalized_type = content_type.split(";")[0].strip()
    
    try:
        # Prepare the audio part
        audio_part = {
            "mime_type": normalized_type,
            "data": audio_bytes
        }

        # Send multimodal request
        response = model.generate_content([
            VOICE_EXTRACTION_PROMPT,
            audio_part
        ])
        
        raw_text = response.text.strip()
        logger.debug(f"🎙️ RAW AI RESPONSE: {raw_text}")

        # Clean potential markdown code fences
        if raw_text.startswith("```"):
            raw_text = raw_text.split("\n", 1)[1] if "\n" in raw_text else raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        try:
            result = json.loads(raw_text)
        except json.JSONDecodeError:
            logger.warning("   ⚠️ AI returned invalid JSON. Falling back to raw transcription.")
            return {
                "name": None,
                "age": None,
                "gender": None,
                "symptoms": raw_text,
                "raw_transcription": raw_text
            }

        # Ensure all keys exist
        return {
            "name": result.get("name"),
            "age": result.get("age"),
            "gender": result.get("gender"),
            "symptoms": result.get("symptoms", result.get("raw_transcription", "No symptoms extracted")),
            "raw_transcription": result.get("raw_transcription", "")
        }

    except Exception as e:
        logger.error(f"Voice extraction agent error: {e}")
        return {
            "name": None,
            "age": None,
            "gender": None,
            "symptoms": f"Extraction failed: {str(e)}",
            "raw_transcription": ""
        }
