"""
Voice Transcription Agent
─────────────────────────
Transcribes medical symptom audio using Google Gemini 2.0 Flash.
Natively supports multimodal audio input.
"""

import logging
from google.generativeai import GenerativeModel

logger = logging.getLogger(__name__)

VOICE_TRANSCRIPTION_PROMPT = """You are a medical transcriptionist for Tandarust AI.

**Task:**
1. Listen to the provided audio of a doctor or patient describing symptoms.
2. Transcribe exactly what is said.
3. If the audio refers to medications, medical history, or vitals, include them.
4. Correct minor grammatical errors but keep the medical terminology accurate.

**Output:**
Return a clean, professional written summary of the symptoms described. No preamble, no "Here is the transcription", just the result.
"""

async def transcribe_audio(
    model: GenerativeModel,
    audio_bytes: bytes,
    content_type: str = "audio/wav",
) -> str:
    """
    Send audio bytes to Gemini for transcription.
    """
    logger.info(f"   Model: Gemini 2.0 Flash (Audio)")
    # Normalize MIME Type: Strip codecs like ';codecs=opus' as Gemini inline_data is picky
    normalized_type = content_type.split(";")[0].strip()
    
    try:
        # Prepare the audio for Gemini
        audio_part = {
            "mime_type": normalized_type,
            "data": audio_bytes
        }

        # Send multimodal request with a hyper-focused prompt
        response = model.generate_content([
            "TRANSCRIPTION TASK: Listen to this audio and write down everything said. If it's a doctor describing a patient, summarize the symptoms. If there is no speech, just say 'No audible speech detected'. DO NOT give a preamble.",
            audio_part
        ])
        
        transcription = response.text.strip()
        logger.debug(f"🎙️ RAW TRANSCRIPTION RESPONSE: {transcription}")

        if not transcription or "No audible speech" in transcription:
            logger.warning("   ⚠️ No speech detected by AI")
            return "No audible speech detected. Please speak clearly and try again."

        logger.info(f"   ✅ SUCCESS - Transcription complete ({len(transcription)} chars)")
        return transcription

    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "quota" in error_msg.lower():
            logger.error(f"⚠️ QUOTA EXCEEDED: {error_msg}")
            return "AI Quota Exceeded. Please wait a few minutes or try again later today."
        
        logger.error(f"Voice transcription agent error: {e}")
        return f"Transcription failed: {error_msg}"
