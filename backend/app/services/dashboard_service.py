"""
Dashboard Service — Aggregate statistics queries.
"""

import logging
from datetime import date
from supabase import Client

logger = logging.getLogger(__name__)


async def get_dashboard_stats(supabase: Client) -> dict:
    """Compute aggregate dashboard statistics from the database with optimized queries."""
    try:
        # Group 1: All patient-related metrics in one query
        # We fetch relevant fields for all patients to compute counts and averages in-memory
        patients_res = supabase.table("patients").select("urgency_level, wait_time, risk_scores").execute()
        patients_data = patients_res.data or []
        
        total_patients = len(patients_data)
        critical_patients = sum(1 for p in patients_data if p.get("urgency_level") == "Critical")
        avg_wait = _compute_avg_wait(patients_data)
        risk_alerts = _count_high_risk(patients_data)

        # Group 2: All prescription-related metrics in one query
        today = date.today().isoformat()
        prescriptions_res = supabase.table("prescriptions").select("status, date").execute()
        prescriptions_data = prescriptions_res.data or []
        
        pending_reviews = sum(1 for p in prescriptions_data if p.get("status") == "Pending")
        prescriptions_today = sum(1 for p in prescriptions_data if p.get("date") == today)

        return {
            "total_patients": total_patients,
            "critical_patients": critical_patients,
            "pending_reviews": pending_reviews,
            "avg_wait_time": avg_wait,
            "prescriptions_today": prescriptions_today,
            "risk_alerts": risk_alerts,
        }

    except Exception as e:
        logger.error(f"Dashboard stats error: {e}")
        return {
            "total_patients": 0,
            "critical_patients": 0,
            "pending_reviews": 0,
            "avg_wait_time": "N/A",
            "prescriptions_today": 0,
            "risk_alerts": 0,
        }


def _compute_avg_wait(rows: list[dict]) -> str:
    """Parse wait_time strings and compute average."""
    if not rows:
        return "0 min"

    total_minutes = 0
    count = 0
    for row in rows:
        wt = row.get("wait_time", "")
        if wt == "Immediate":
            total_minutes += 0
            count += 1
        elif "min" in wt:
            try:
                minutes = int("".join(c for c in wt if c.isdigit()))
                total_minutes += minutes
                count += 1
            except ValueError:
                pass

    if count == 0:
        return "0 min"
    avg = round(total_minutes / count)
    return f"{avg} min"


def _count_high_risk(rows: list[dict]) -> int:
    """Count patients with at least one risk score >= 70."""
    count = 0
    for row in rows:
        scores = row.get("risk_scores", [])
        if isinstance(scores, list):
            for rs in scores:
                if isinstance(rs, dict) and rs.get("score", 0) >= 70:
                    count += 1
                    break  # count each patient only once
    return count
