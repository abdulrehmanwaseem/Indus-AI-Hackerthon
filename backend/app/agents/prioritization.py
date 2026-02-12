"""
Patient Prioritization Agent
─────────────────────────────
Accepts patient symptoms, age, gender, and history.
Returns urgency score (0-100), urgency level, estimated wait time, and reasoning.
Uses Google Gemini 2.0 Flash for multi-step clinical reasoning.
"""

import json
import logging
from google.generativeai import GenerativeModel

logger = logging.getLogger(__name__)

PRIORITIZATION_PROMPT = """You are a clinical triage AI assistant for Tandarust AI, a healthcare clinic system.

Given a patient's information, assess the urgency of their condition and assign a priority score.

**Patient Information:**
- Name: {name}
- Age: {age}
- Gender: {gender}
- Symptoms: {symptoms}
- Medical History: {history}

**Instructions:**
1. Analyze the symptoms in the context of the patient's age, gender, and history.
2. Consider red-flag symptoms that require immediate attention (chest pain, stroke signs, breathing difficulty, etc.).
3. Assign an urgency score from 0 to 100:
   - 0-25: Low (routine, non-urgent)
   - 26-55: Medium (needs attention within 30 min)
   - 56-80: High (needs attention within 5-10 min)
   - 81-100: Critical (immediate attention required)
4. Estimate a wait time based on urgency.
5. Provide brief clinical reasoning.

**You MUST respond with ONLY valid JSON in this exact format:**
{{
    "urgency_score": <integer 0-100>,
    "urgency_level": "<Low|Medium|High|Critical>",
    "wait_time": "<e.g. Immediate, 5 min, 20 min, 45 min>",
    "reasoning": "<2-3 sentence clinical reasoning>"
}}

Respond with JSON only. No markdown, no code fences, no extra text.
"""


async def assess_patient_priority(
    model: GenerativeModel,
    name: str,
    age: int,
    gender: str,
    symptoms: str,
    history: list[str],
) -> dict:
    """
    Call Gemini to assess patient urgency.
    Returns dict with urgency_score, urgency_level, wait_time, reasoning.
    """
    history_str = ", ".join(history) if history else "No significant history"

    prompt = PRIORITIZATION_PROMPT.format(
        name=name,
        age=age,
        gender=gender,
        symptoms=symptoms,
        history=history_str,
    )

    logger.info(f"🔍 PRIORITIZATION AGENT")
    logger.info(f"   Patient: {name}, Age: {age}, Gender: {gender}")
    logger.info(f"   Symptoms: {symptoms}")
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

        # Validate and clamp values
        score = max(0, min(100, int(result.get("urgency_score", 50))))
        level = result.get("urgency_level", "Medium")
        if level not in ("Low", "Medium", "High", "Critical"):
            level = _score_to_level(score)

        logger.info(f"   ✅ SUCCESS")
        logger.info(f"   Urgency Score: {score}/100")
        logger.info(f"   Urgency Level: {level}")
        logger.info(f"   Wait Time: {result.get('wait_time', _score_to_wait(score))}")
        logger.debug(f"   Reasoning: {result.get('reasoning', '')}")

        return {
            "urgency_score": score,
            "urgency_level": level,
            "wait_time": result.get("wait_time", _score_to_wait(score)),
            "reasoning": result.get("reasoning", ""),
        }

    except Exception as e:
        logger.error(f"   ❌ FAILED: {e}")
        # Fallback: assign medium urgency
        return {
            "urgency_score": 50,
            "urgency_level": "Medium",
            "wait_time": "20 min",
            "reasoning": f"AI assessment unavailable — defaulting to Medium urgency. Error: {str(e)}",
        }


def _score_to_level(score: int) -> str:
    if score >= 81:
        return "Critical"
    if score >= 56:
        return "High"
    if score >= 26:
        return "Medium"
    return "Low"


def _score_to_wait(score: int) -> str:
    if score >= 81:
        return "Immediate"
    if score >= 56:
        return "5 min"
    if score >= 26:
        return "20 min"
    return "45 min"
