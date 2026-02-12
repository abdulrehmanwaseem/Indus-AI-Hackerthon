"""
Prescription Router — Upload, digitize, list, update status.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from supabase import Client
from google.generativeai import GenerativeModel

from app.dependencies import get_supabase_admin, get_current_user, get_gemini_model, role_required
from app.models.prescription import (
    PrescriptionResponse,
    PrescriptionListResponse,
    PrescriptionStatusUpdate,
)
from app.services import prescription_service
from app.agents.prescription_ocr import digitize_prescription

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"}


def _format_prescription(row: dict) -> PrescriptionResponse:
    """Convert a DB row dict to a PrescriptionResponse."""
    return PrescriptionResponse(
        id=str(row["id"]),
        patient_name=row["patient_name"],
        date=str(row["date"]),
        medications=row.get("medications", []),
        status=row["status"],
        image_url=row.get("image_url"),
        created_at=str(row.get("created_at", "")),
    )


@router.post("/digitize", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED)
async def digitize_and_create(
    file: UploadFile = File(...),
    patient_name: str = Form(...),
    patient_id: str = Form(default=None),
    current_user=Depends(role_required(["doctor", "admin"])),
    supabase: Client = Depends(get_supabase_admin),
    gemini: GenerativeModel = Depends(get_gemini_model),
):
    """
    Upload a prescription image → OCR via Gemini Vision → store structured result.

    1. Validate image type
    2. Upload image to Supabase Storage
    3. Digitize via Gemini Vision (extract medications)
    4. Store prescription record in DB
    5. Return structured result
    """
    # Validate file type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Allowed: JPEG, PNG, WebP, HEIC.",
        )

    # Read image bytes
    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 10MB.",
        )

    # ── Step 1: Upload to Supabase Storage ──
    try:
        image_url = await prescription_service.upload_prescription_image(
            supabase, image_bytes, file.filename or "prescription.jpg"
        )
    except Exception as e:
        # Non-fatal — continue without image URL
        image_url = None

    # ── Step 2: Digitize via Gemini Vision ──
    ocr_result = await digitize_prescription(
        model=gemini,
        image_bytes=image_bytes,
        content_type=file.content_type or "image/jpeg",
    )

    medications = ocr_result.get("medications", [])
    rx_status = "Digitized" if medications else "Pending"

    # ── Step 3: Store in DB ──
    row = await prescription_service.create_prescription(
        supabase=supabase,
        patient_name=patient_name,
        medications=medications,
        status=rx_status,
        image_url=image_url,
        patient_id=patient_id,
    )

    if not row:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create prescription record.",
        )

    return _format_prescription(row)


@router.get("", response_model=PrescriptionListResponse)
async def list_prescriptions(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user=Depends(role_required(["doctor", "admin"])),
    supabase: Client = Depends(get_supabase_admin),
):
    """List all prescriptions sorted by date (newest first)."""
    rows, total = await prescription_service.get_prescriptions(supabase, limit, offset)
    prescriptions = [_format_prescription(r) for r in rows]
    return PrescriptionListResponse(prescriptions=prescriptions, total=total)


@router.get("/{prescription_id}", response_model=PrescriptionResponse)
async def get_prescription(
    prescription_id: str,
    current_user=Depends(get_current_user),
    supabase: Client = Depends(get_supabase_admin),
):
    """Get a single prescription by ID."""
    row = await prescription_service.get_prescription_by_id(supabase, prescription_id)
    if not row:
        raise HTTPException(status_code=404, detail="Prescription not found.")
    return _format_prescription(row)


@router.patch("/{prescription_id}/status", response_model=PrescriptionResponse)
async def update_status(
    prescription_id: str,
    body: PrescriptionStatusUpdate,
    current_user=Depends(role_required(["doctor", "admin"])),
    supabase: Client = Depends(get_supabase_admin),
):
    """Update prescription status (Pending → Digitized → Verified)."""
    try:
        row = await prescription_service.update_prescription_status(
            supabase, prescription_id, body.status
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    if not row:
        raise HTTPException(status_code=404, detail="Prescription not found.")
    return _format_prescription(row)
