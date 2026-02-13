"""
Patient Router — CRUD + AI triage pipeline.
"""

import json
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from supabase import Client
from google.generativeai import GenerativeModel

from app.dependencies import get_supabase_admin, get_current_user, get_gemini_model, role_required
from app.models.patient import PatientCreateRequest, PatientResponse, PatientListResponse
from app.services import patient_service
from app.agents.prioritization import assess_patient_priority
from app.agents.risk_analyzer import analyze_risks
from app.agents.summary import generate_summary
from app.agents.voice_transcription import transcribe_audio

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("/transcribe-voice")
async def transcribe_voice(
    file: UploadFile = File(...),
    current_user=Depends(role_required(["doctor", "admin"])),
    gemini: GenerativeModel = Depends(get_gemini_model),
):
    """
    Transcribe patient symptoms from audio file using Gemini.
    """
    # Relaxed validation to handle codecs (e.g., 'audio/webm;codecs=opus')
    allowed_types = ["audio/wav", "audio/mpeg", "audio/webm", "audio/ogg", "audio/x-wav", "audio/mp3"]
    if not any(t in file.content_type for t in allowed_types):
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid audio format '{file.content_type}'. Supported: WAV, MP3, WebM, OGG.",
        )
    
    audio_bytes = await file.read()
    result = await transcribe_audio(
        model=gemini,
        audio_bytes=audio_bytes,
        content_type=file.content_type
    )
    
    return result


def _make_avatar(name: str) -> str:
    """Generate initials from a name, e.g. 'Ahmed Khan' → 'AK'."""
    parts = name.strip().split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    return name[:2].upper() if name else "??"


def _format_patient(row: dict) -> PatientResponse:
    """Convert a DB row dict to a PatientResponse."""
    
    summary = row.get("ai_summary", "")
    # Handle if ai_summary is stored as a JSON string or a dict
    if isinstance(summary, str) and (summary.startswith("{") or summary.startswith("[")):
        try:
            summary = json.loads(summary)
        except:
            pass
            
    # If it's a simple string (old data), wrap it in the new format for the UI
    if isinstance(summary, str):
        summary = {
            "clinical_summary_en": summary,
            "clinical_summary_ur": "قدیم ڈیٹا کیلئے خلاصہ دستیاب نہیں ہے۔",
            "patient_friendly_summary": "Legacy summary data.",
            "suggested_actions": ["Review legacy data"]
        }

    return PatientResponse(
        id=str(row["id"]),
        name=row["name"],
        age=row["age"],
        gender=row["gender"],
        symptoms=row["symptoms"],
        urgency_score=row["urgency_score"],
        urgency_level=row["urgency_level"],
        wait_time=row["wait_time"],
        avatar=row.get("avatar", ""),
        history=row.get("history", []),
        risk_scores=row.get("risk_scores", []),
        ai_summary=summary,
        created_at=str(row.get("created_at", "")),
    )


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    body: PatientCreateRequest,
    current_user=Depends(role_required(["doctor", "admin"])),
    supabase: Client = Depends(get_supabase_admin),
    gemini: GenerativeModel = Depends(get_gemini_model),
):
    """
    Full AI triage pipeline:
    1. Patient Prioritization Agent → urgency score/level/wait
    2. Risk Analyzer Agent → risk scores
    3. Summary Agent → doctor-ready AI summary
    4. Store in DB → return complete patient record
    """
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"═══════════════════════════════════════════════════════════")
    logger.info(f"📋 CREATE PATIENT REQUEST")
    logger.info(f"   Patient: {body.name}, Age: {body.age}")
    if body.medical_history:
        logger.info(f"   Medical History (raw): {body.medical_history}")
    logger.info(f"═══════════════════════════════════════════════════════════")
    
    # ── Handle History Conversion ──
    # If frontend sends medical_history as string and history is empty, convert it
    history = body.history
    if not history and body.medical_history:
        history = [h.strip() for h in body.medical_history.split(",") if h.strip()]
    
    try:
        # ── Step 1: Prioritization ──
        logger.info(f"\n1️⃣  STEP 1: PATIENT PRIORITIZATION")
        priority = await assess_patient_priority(
            model=gemini,
            name=body.name,
            age=body.age,
            gender=body.gender,
            symptoms=body.symptoms,
            history=history,
        )
        logger.info(f"   ✅ Priority result: {priority}")

        # ── Step 2: Risk Analysis ──
        logger.info(f"\n2️⃣  STEP 2: RISK ANALYSIS")
        risk_scores = await analyze_risks(
            model=gemini,
            age=body.age,
            gender=body.gender,
            symptoms=body.symptoms,
            history=history,
        )
        logger.info(f"   ✅ Risk scores ({len(risk_scores)} conditions): {risk_scores}")

        # ── Step 3: Summary Generation ──
        logger.info(f"\n3️⃣  STEP 3: SUMMARY GENERATION")
        ai_summary = await generate_summary(
            model=gemini,
            name=body.name,
            age=body.age,
            gender=body.gender,
            symptoms=body.symptoms,
            history=history,
            urgency_score=priority["urgency_score"],
            urgency_level=priority["urgency_level"],
            risk_scores=risk_scores,
        )
        logger.info(f"   ✅ Summary generated: {json.dumps(ai_summary)[:100]}...")

        # ── Step 4: Build full patient data ──
        logger.info(f"\n4️⃣  STEP 4: BUILD PATIENT DATA")
        patient_data = {
            "name": body.name,
            "age": body.age,
            "gender": body.gender,
            "symptoms": body.symptoms,
            "history": history,
            "medical_history": body.medical_history, 
            "avatar": _make_avatar(body.name),
            "urgency_score": priority["urgency_score"],
            "urgency_level": priority["urgency_level"],
            "wait_time": priority["wait_time"],
            "risk_scores": risk_scores,
            "ai_summary": ai_summary,
        }
        logger.info(f"   ✅ Patient data built (with AI insights)")

        # ── Step 5: Store in DB ──
        logger.info(f"\n5️⃣  STEP 5: STORE IN DATABASE")
        row = await patient_service.create_patient(
            supabase, patient_data, user_id=str(current_user.id)
        )

        if not row:
            logger.error(f"   ❌ Failed to create patient record in DB")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create patient record.",
            )

        logger.info(f"   ✅ Patient stored with ID: {row.get('id')}")
        logger.info(f"═══════════════════════════════════════════════════════════\n")

        return _format_patient(row)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ PATIENT CREATION FAILED: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Patient creation failed: {str(e)}"
        )


@router.get("", response_model=PatientListResponse)
async def list_patients(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user=Depends(role_required(["doctor", "admin"])),
    supabase: Client = Depends(get_supabase_admin),
):
    """List all patients sorted by urgency (highest first)."""
    rows, total = await patient_service.get_patients(supabase, limit, offset)
    patients = [_format_patient(r) for r in rows]
    return PatientListResponse(patients=patients, total=total)


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: str,
    current_user=Depends(get_current_user),
    supabase: Client = Depends(get_supabase_admin),
):
    """Get a single patient by ID."""
    row = await patient_service.get_patient_by_id(supabase, patient_id)
    if not row:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return _format_patient(row)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: str,
    current_user=Depends(role_required(["doctor", "admin"])),
    supabase: Client = Depends(get_supabase_admin),
):
    """Delete a patient record."""
    success = await patient_service.delete_patient(supabase, patient_id)
    if not success:
        raise HTTPException(status_code=404, detail="Patient not found.")
