from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_patients: int
    critical_patients: int
    pending_reviews: int
    avg_wait_time: str
    prescriptions_today: int
    risk_alerts: int
