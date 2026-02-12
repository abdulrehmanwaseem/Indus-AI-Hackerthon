"""
Dashboard Router — Aggregate stats for the doctor dashboard.
"""

from fastapi import APIRouter, Depends
from supabase import Client

from app.dependencies import get_supabase_admin, get_current_user, role_required
from app.models.dashboard import DashboardStats
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    current_user=Depends(role_required(["doctor", "admin"])),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Returns aggregated dashboard statistics:
    - total_patients, critical_patients, pending_reviews
    - avg_wait_time, prescriptions_today, risk_alerts
    """
    stats = await dashboard_service.get_dashboard_stats(supabase)
    return DashboardStats(**stats)
