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

import re

logger = logging.getLogger(__name__)

PRESCRIPTION_OCR_PROMPT = """Read this prescription image. 
Extract the following fields into JSON:
- patient_name (at the top)
- age (number)
- gender (Male/Female)
- medications (list of {drug, dosage, frequency, duration})
- notes (any extra info like 'Makati City' or 'Next to hospital')

Respond with JSON only. No text, no markdown.
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
        logger.debug(f"💊 RAW AI RESPONSE: {raw_text}")

        # Clean potential markdown code fences
        if raw_text.startswith("```"):
            raw_text = raw_text.split("\n", 1)[1] if "\n" in raw_text else raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        result = json.loads(raw_text)
        
        # Robust Name Extraction
        patient_name = result.get("patient_name") or result.get("name") or result.get("Patient Name")

        # Robust Gender Parsing
        gender_val = result.get("gender") or result.get("sex") or result.get("Sex")
        gender = None
        if gender_val:
            gender_str = str(gender_val).strip().lower()
            if gender_str.startswith("m") or "male" in gender_str: gender = "Male"
            elif gender_str.startswith("f") or "female" in gender_str: gender = "Female"
            else: gender = "Other"

        # Ensure age is integer
        age_val = result.get("age") or result.get("Age")
        age = None
        try:
            if age_val is not None:
                # Use re (already imported at top or here)
                age_digits = "".join(re.findall(r'\d+', str(age_val)))
                age = int(age_digits) if age_digits else None
        except (ValueError, TypeError):
            age = None

        medications = result.get("medications", [])
        validated_meds = []
        for med in medications:
            validated_meds.append({
                "drug": med.get("drug") or med.get("name") or "Unknown",
                "dosage": med.get("dosage", "N/A"),
                "frequency": med.get("frequency", "N/A"),
                "duration": med.get("duration", "N/A"),
            })

        logger.info(f"   ✅ SUCCESS - {len(validated_meds)} medications extracted")
        if patient_name:
            logger.info(f"   👤 Patient: {patient_name} ({age}, {gender})")

        return {
            "patient_name": patient_name,
            "age": age,
            "gender": gender,
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
