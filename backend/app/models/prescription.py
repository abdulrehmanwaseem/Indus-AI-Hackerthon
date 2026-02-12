from pydantic import BaseModel
from typing import Optional


# ── Sub-models ────────────────────────────────────────
class Medication(BaseModel):
    drug: str
    dosage: str
    frequency: str
    duration: str


# ── Requests ──────────────────────────────────────────
class PrescriptionStatusUpdate(BaseModel):
    status: str  # Pending | Digitized | Verified


# ── Responses ─────────────────────────────────────────
class PrescriptionResponse(BaseModel):
    id: str
    patient_name: str
    date: str
    medications: list[Medication]
    status: str  # Pending | Digitized | Verified
    image_url: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class PrescriptionListResponse(BaseModel):
    prescriptions: list[PrescriptionResponse]
    total: int
