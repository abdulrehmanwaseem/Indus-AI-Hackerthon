"""
Dashboard Service — Aggregate statistics queries.
"""

import logging
from datetime import date
from supabase import Client

logger = logging.getLogger(__name__)


async def get_dashboard_stats(supabase: Client) -> dict:
    """Compute aggregate dashboard statistics using optimized database counts and minimal data transfer."""
    try:
        # Group 1: Efficient counts using PostgREST (no row data transferred)
        total_res = supabase.table("patients").select("id", count="exact").limit(1).execute()
        critical_res = supabase.table("patients").select("id", count="exact").eq("urgency_level", "Critical").limit(1).execute()
        pending_res = supabase.table("prescriptions").select("id", count="exact").eq("status", "Pending").limit(1).execute()
        
        today = date.today().isoformat()
        today_rx_res = supabase.table("prescriptions").select("id", count="exact").eq("date", today).limit(1).execute()

        # Group 2: Fetch only necessary fields for complex aggregations
        # This is still faster than fetching all columns (*)
        calc_res = supabase.table("patients").select("wait_time, risk_scores").execute()
        patients_data = calc_res.data or []
        
        avg_wait = _compute_avg_wait(patients_data)
        risk_alerts = _count_high_risk(patients_data)

        return {
            "total_patients": total_res.count or 0,
            "critical_patients": critical_res.count or 0,
            "pending_reviews": pending_res.count or 0,
            "avg_wait_time": avg_wait,
            "prescriptions_today": today_rx_res.count or 0,
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
