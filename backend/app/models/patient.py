from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ── Sub-models ────────────────────────────────────────
class RiskScore(BaseModel):
    condition: str
    score: int  # 0-100
    level: str  # Low | Medium | High | Critical
    reason: Optional[str] = None


class AISummary(BaseModel):
    clinical_summary_en: str
    clinical_summary_ur: str
    patient_friendly_summary: str
    suggested_actions: list[str]


# ── Requests ──────────────────────────────────────────
class PatientCreateRequest(BaseModel):
    name: str
    age: int
    gender: str  # Male | Female | Other
    symptoms: str
    history: list[str] = []


# ── Responses ─────────────────────────────────────────
class PatientResponse(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    symptoms: str
    urgency_score: int
    urgency_level: str  # Low | Medium | High | Critical
    wait_time: str
    avatar: str
    history: list[str]
    risk_scores: list[RiskScore]
    ai_summary: Optional[AISummary] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class PatientListResponse(BaseModel):
    patients: list[PatientResponse]
    total: int
