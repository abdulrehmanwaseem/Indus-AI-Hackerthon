"""
Risk Analyzer Agent
────────────────────
Analyzes patient symptoms, history, age, and gender to predict
potential health risks with scores and severity levels.
Uses Google Gemini 2.0 Flash.
"""

import json
import logging
from google.generativeai import GenerativeModel

logger = logging.getLogger(__name__)

RISK_ANALYSIS_PROMPT = """You are a clinical risk analysis AI for Tandarust AI, a healthcare system.

Given a patient's information, identify potential health risks and score each one.

**Patient Information:**
- Age: {age}
- Gender: {gender}
- Symptoms: {symptoms}
- Medical History: {history}

**Instructions:**
1. Identify 1-5 potential health conditions the patient may be at risk for.
2. Consider the symptoms, age, gender, and history together.
3. For each condition, assign a risk score (0-100) and a severity level.
4. Common conditions to consider: Cardiac Event, Stroke, Diabetes Complication, COPD Exacerbation, Infection, Neurological, Hypertension, Respiratory, Autoimmune, Cancer, Kidney Disease, etc.
5. Only include conditions that are relevant to this specific patient.

**Score ranges:**
- 0-30: Low risk
- 31-60: Medium risk
- 61-80: High risk
- 81-100: Critical risk

**You MUST respond with ONLY valid JSON in this exact format:**
{{
    "risk_scores": [
        {{
            "condition": "<condition name>",
            "score": <integer 0-100>,
            "level": "<Low|Medium|High|Critical>",
            "reason": "<one sentence explanation of why this risk was identified>"
        }}
    ]
}}

Respond with JSON only. No markdown, no code fences, no extra text.
"""


async def analyze_risks(
    model: GenerativeModel,
    age: int,
    gender: str,
    symptoms: str,
    history: list[str],
) -> list[dict]:
    """
    Call Gemini to analyze health risks.
    Returns list of { condition, score, level } dicts.
    """
    history_str = ", ".join(history) if history else "No significant history"

    prompt = RISK_ANALYSIS_PROMPT.format(
        age=age,
        gender=gender,
        symptoms=symptoms,
        history=history_str,
    )

    logger.info(f"⚠️  RISK ANALYZER AGENT")
    logger.info(f"   Model: Gemini 2.0 Flash (Risk Explanation)")

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
        risk_scores = result.get("risk_scores", [])

        # Validate each risk score
        validated = []
        for rs in risk_scores:
            score = max(0, min(100, int(rs.get("score", 0))))
            level = rs.get("level", "Low")
            if level not in ("Low", "Medium", "High", "Critical"):
                level = _score_to_level(score)
            validated.append({
                "condition": rs.get("condition", "Unknown"),
                "score": score,
                "level": level,
                "reason": rs.get("reason", "Based on clinical symptom matching.")
            })

        logger.info(f"   ✅ SUCCESS - {len(validated)} conditions identified")
        for risk in validated:
            logger.info(f"      • {risk['condition']}: {risk['score']}/100 ({risk['level']}) - {risk['reason']}")

        return validated if validated else _default_risk(symptoms)

    except Exception as e:
        logger.error(f"   ❌ FAILED: {e}")
        return _default_risk(symptoms)


def _score_to_level(score: int) -> str:
    if score >= 81:
        return "Critical"
    if score >= 61:
        return "High"
    if score >= 31:
        return "Medium"
    return "Low"


def _default_risk(symptoms: str) -> list[dict]:
    """Fallback risk when AI fails."""
    return [
        {
            "condition": "General Health Assessment",
            "score": 30,
            "level": "Low",
        }
    ]
