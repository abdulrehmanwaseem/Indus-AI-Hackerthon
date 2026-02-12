"""
Prescription Digitizer Agent (OCR)
────────────────────────────────────
Converts handwritten prescription images into structured medication data.
Uses Google Gemini 2.0 Flash Vision (multimodal) — no external OCR needed.
"""

import json
import logging
from PIL import Image
import io
from google.generativeai import GenerativeModel

logger = logging.getLogger(__name__)

PRESCRIPTION_OCR_PROMPT = """You are a medical prescription digitizer AI for Tandarust AI.

You are given an image of a handwritten medical prescription. Your task is to extract ALL medications from it and return structured data.

**Instructions:**
1. Carefully read the handwritten prescription image.
2. Extract every medication listed, including:
   - Drug name (use standard/generic name if possible)
   - Dosage (e.g., 500mg, 5ml, 100mcg)
   - Frequency (e.g., Once daily, Twice daily, Every 6 hours, PRN)
   - Duration (e.g., 7 days, Ongoing, As needed)
3. If a field is illegible, make your best guess and note it in the drug name with [unclear].
4. If the image is not a prescription or is completely unreadable, return an empty medications array.

**You MUST respond with ONLY valid JSON in this exact format:**
{{
    "medications": [
        {{
            "drug": "<medication name>",
            "dosage": "<dosage>",
            "frequency": "<frequency>",
            "duration": "<duration>"
        }}
    ],
    "notes": "<any additional notes about legibility or special instructions>"
}}

Respond with JSON only. No markdown, no code fences, no extra text.
"""


async def digitize_prescription(
    model: GenerativeModel,
    image_bytes: bytes,
    content_type: str = "image/jpeg",
) -> dict:
    """
    Send a prescription image to Gemini Vision for OCR + structuring.
    Returns dict with medications list and optional notes.
    """
    logger.info(f"💊 PRESCRIPTION OCR AGENT")
    logger.info(f"   Image Size: {len(image_bytes)} bytes")
    logger.info(f"   Content Type: {content_type}")
    logger.info(f"   Model: Gemini 2.5 Flash (Vision)")
    logger.info(f"   Status: STARTING...")

    try:
        # Prepare the image for Gemini
        image = Image.open(io.BytesIO(image_bytes))
        logger.debug(f"   Image loaded: {image.format} {image.size}")

        # Send multimodal request (image + text prompt)
        response = model.generate_content([PRESCRIPTION_OCR_PROMPT, image])
        raw_text = response.text.strip()

        # Clean potential markdown code fences
        if raw_text.startswith("```"):
            raw_text = raw_text.split("\n", 1)[1] if "\n" in raw_text else raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        result = json.loads(raw_text)
        medications = result.get("medications", [])

        # Validate medication entries
        validated_meds = []
        for med in medications:
            validated_meds.append({
                "drug": med.get("drug", "Unknown"),
                "dosage": med.get("dosage", "N/A"),
                "frequency": med.get("frequency", "N/A"),
                "duration": med.get("duration", "N/A"),
            })

        logger.info(f"   ✅ SUCCESS - {len(validated_meds)} medications extracted")
        for med in validated_meds:
            logger.info(f"      • {med['drug']}: {med['dosage']} {med['frequency']}")
        if result.get("notes"):
            logger.debug(f"   Notes: {result.get('notes')}")

        return {
            "medications": validated_meds,
            "notes": result.get("notes", ""),
        }

    except json.JSONDecodeError as e:
        logger.error(f"   ❌ JSON Parse Failed: {e}")
        return {
            "medications": [],
            "notes": "Failed to parse prescription. The image may be unclear or not a valid prescription.",
        }
    except Exception as e:
        logger.error(f"Prescription OCR agent error: {e}")
        return {
            "medications": [],
            "notes": f"OCR processing failed: {str(e)}. Please try uploading a clearer image.",
        }
