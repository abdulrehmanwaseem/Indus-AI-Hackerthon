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

Generate a concise, doctor-ready clinical summary for this patient.

**Patient Information:**
- Name: {name}
- Age: {age}
- Gender: {gender}
- Symptoms: {symptoms}
- Medical History: {history}
- Urgency Level: {urgency_level} (Score: {urgency_score}/100)
- Risk Scores: {risk_scores}

**Instructions:**
1. Write a 2-4 sentence clinical summary that a doctor can quickly scan.
2. Highlight the most critical findings first.
3. Include actionable recommendations (tests, immediate treatments, monitoring).
4. Be professional and medically precise.
5. Do NOT use patient name in the summary.

**You MUST respond with ONLY valid JSON in this exact format:**
{{
    "ai_summary": "<2-4 sentence clinical summary>"
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
) -> str:
    """
    Generate a doctor-ready clinical summary.
    Returns the summary string.
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
    logger.info(f"   Patient: {name}, Urgency: {urgency_level} ({urgency_score}/100)")
    logger.info(f"   Risk Conditions: {len(risk_scores)}")
    logger.info(f"   Model: Gemini 2.5 Flash")
    logger.info(f"   Status: STARTING...")

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
        summary = result.get("ai_summary", "Summary generation failed — please review patient data manually.")
        
        logger.info(f"   ✅ SUCCESS - {len(summary)} chars generated")
        logger.debug(f"   Summary: {summary}")
        
        return summary

    except Exception as e:
        logger.error(f"   ❌ FAILED: {e}")
        return (
            f"AI summary unavailable. Patient presents with: {symptoms}. "
            f"History includes: {history_str}. "
            f"Urgency assessed as {urgency_level} ({urgency_score}/100). Manual review recommended."
        )
