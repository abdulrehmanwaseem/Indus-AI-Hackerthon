"""
Patient Service — CRUD operations via Supabase.
"""

import logging
import json
import logging
from supabase import Client

logger = logging.getLogger(__name__)


def _table_missing(e: Exception) -> bool:
    """Check if exception is due to missing table."""
    error_str = str(e).lower()
    return "pgrst205" in error_str or "could not find the table" in error_str


async def create_patient(supabase: Client, patient_data: dict, user_id: str = None) -> dict:
    """Insert a new patient record and return the created row."""
    # Serialize AI summary dict to JSON string for storage in TEXT column
    ai_summary = patient_data.get("ai_summary", "")
    if isinstance(ai_summary, dict):
        ai_summary = json.dumps(ai_summary)

    payload = {
        "name": patient_data["name"],
        "age": patient_data["age"],
        "gender": patient_data["gender"],
        "symptoms": patient_data["symptoms"],
        "urgency_score": patient_data["urgency_score"],
        "urgency_level": patient_data["urgency_level"],
        "wait_time": patient_data["wait_time"],
        "avatar": patient_data.get("avatar", ""),
        "history": patient_data.get("history", []),
        "risk_scores": patient_data.get("risk_scores", []),
        "ai_summary": ai_summary,
    }
    if user_id:
        payload["created_by"] = user_id

    try:
        result = supabase.table("patients").insert(payload).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        if _table_missing(e):
            logger.warning("patients table does not exist yet. Run the SQL migration.")
            raise ValueError("Database table 'patients' not found. Please run the SQL migration in Supabase.")
        raise


async def get_patients(
    supabase: Client, limit: int = 50, offset: int = 0
) -> tuple[list[dict], int]:
    """Fetch patients sorted by urgency (highest first). Returns (rows, total_count)."""
    try:
        # Fetch data and count in a single request
        result = (
            supabase.table("patients")
            .select("*", count="exact")
            .order("urgency_score", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
        return result.data or [], result.count or 0
    except Exception as e:
        if _table_missing(e):
            logger.warning("patients table does not exist yet - returning empty list.")
            return [], 0
        raise


async def get_patient_by_id(supabase: Client, patient_id: str) -> dict | None:
    """Fetch a single patient by ID."""
    try:
        result = (
            supabase.table("patients")
            .select("*")
            .eq("id", patient_id)
            .single()
            .execute()
        )
        return result.data
    except Exception as e:
        if _table_missing(e):
            logger.warning("patients table does not exist yet.")
            return None
        raise


async def delete_patient(supabase: Client, patient_id: str) -> bool:
    """Delete a patient record. Returns True if successful."""
    try:
        result = supabase.table("patients").delete().eq("id", patient_id).execute()
        return bool(result.data)
    except Exception as e:
        if _table_missing(e):
            logger.warning("patients table does not exist yet.")
            return False
        raise
