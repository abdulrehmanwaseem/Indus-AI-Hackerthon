"""
Guidance / Summary Agent
─────────────────────────
Generates a concise, doctor-ready clinical summary from patient data.
Uses Google Gemini 2.0 Flash.
"""

import json
import logging
from google.generativeai import GenerativeModel

logger = logging.getLogger(__name__)

SUMMARY_PROMPT = """You are a clinical summary AI for Tandarust AI, a healthcare system.

Generate a comprehensive, doctor-ready clinical summary and a patient-friendly summary.

**Patient Information:**
- Name: {name}
- Age: {age}
- Gender: {gender}
- Symptoms: {symptoms}
- Medical History: {history}
- Urgency Level: {urgency_level} (Score: {urgency_score}/100)
- Risk Scores: {risk_scores}

**Instructions:**
1. **Clinical Summary (English):** 2-4 professional, precise sentences for doctors. Highlight critical findings first. Include monitoring/test suggestions.
2. **Clinical Summary (Urdu):** Translate the key points of the clinical summary into clean, professional Urdu.
3. **Patient Perspective (English):** A simple, encouraging, non-alarming explanation for the patient about what happens next.
4. **Suggested Actions:** List 2-3 immediate medical steps or tests recommended.

**You MUST respond with ONLY valid JSON in this exact format:**
{{
    "clinical_summary_en": "<professional clinical summary>",
    "clinical_summary_ur": "<professional clinical summary in Urdu>",
    "patient_friendly_summary": "<plain language explanation for patient>",
    "suggested_actions": ["action 1", "action 2"]
}}

Respond with JSON only. No markdown, no code fences, no extra text.
"""


async def generate_summary(
    model: GenerativeModel,
    name: str,
    age: int,
    gender: str,
    symptoms: str,
    history: list[str],
    urgency_score: int,
    urgency_level: str,
    risk_scores: list[dict],
) -> dict:
    """
    Generate complex AI insights including bilingual summaries and suggested actions.
    Returns a dict with: clinical_summary_en, clinical_summary_ur, patient_friendly_summary, suggested_actions.
    """
    history_str = ", ".join(history) if history else "No significant history"
    risk_str = ", ".join(
        f"{r['condition']}: {r['score']}/100 ({r['level']})" for r in risk_scores
    ) if risk_scores else "No specific risks identified"

    prompt = SUMMARY_PROMPT.format(
        name=name,
        age=age,
        gender=gender,
        symptoms=symptoms,
        history=history_str,
        urgency_level=urgency_level,
        urgency_score=urgency_score,
        risk_scores=risk_str,
    )

    logger.info(f"📝 SUMMARY AGENT")
    logger.info(f"   Model: Gemini 2.0 Flash (Summary & Urdu)")

    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        # Clean potential markdown code fences
        if raw_text.startswith("```"):
            raw_text = raw_text.split("\n", 1)[1] if "\n" in raw_text else raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        result = json.loads(raw_text)
        
        # Ensure all fields exist
        return {
            "clinical_summary_en": result.get("clinical_summary_en", "Manual review required."),
            "clinical_summary_ur": result.get("clinical_summary_ur", "اردو خلاصہ دستیاب نہیں ہے۔"),
            "patient_friendly_summary": result.get("patient_friendly_summary", "Our medical team will review your case shortly."),
            "suggested_actions": result.get("suggested_actions", ["Initial nurse assessment", "Vital sign monitoring"])
        }

    except Exception as e:
        logger.error(f"   ❌ FAILED: {e}")
        return {
            "clinical_summary_en": f"AI Insight Error. Symptoms: {symptoms[:50]}...",
            "clinical_summary_ur": "اے آئی کی خرابی - دستی جائزہ درکار ہے۔",
            "patient_friendly_summary": "We are processing your data. A professional will assist you soon.",
            "suggested_actions": ["Manual triage required"]
        }
