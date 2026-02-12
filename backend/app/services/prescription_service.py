"""
Prescription Service — CRUD + image storage via Supabase.
"""

import logging
import uuid
from datetime import date
from supabase import Client

logger = logging.getLogger(__name__)


async def create_prescription(
    supabase: Client,
    patient_name: str,
    medications: list[dict],
    status: str = "Digitized",
    image_url: str = None,
    patient_id: str = None,
) -> dict:
    """Insert a new prescription record."""
    payload = {
        "patient_name": patient_name,
        "date": date.today().isoformat(),
        "medications": medications,
        "status": status,
    }
    if image_url:
        payload["image_url"] = image_url
    if patient_id:
        payload["patient_id"] = patient_id

    result = supabase.table("prescriptions").insert(payload).execute()
    return result.data[0] if result.data else {}


async def get_prescriptions(
    supabase: Client, limit: int = 50, offset: int = 0
) -> tuple[list[dict], int]:
    """Fetch prescriptions ordered by date descending."""
    count_result = (
        supabase.table("prescriptions").select("id", count="exact").execute()
    )
    total = count_result.count or 0

    result = (
        supabase.table("prescriptions")
        .select("*")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return result.data or [], total


async def get_prescription_by_id(supabase: Client, prescription_id: str) -> dict | None:
    """Fetch a single prescription by ID."""
    result = (
        supabase.table("prescriptions")
        .select("*")
        .eq("id", prescription_id)
        .single()
        .execute()
    )
    return result.data


async def update_prescription_status(
    supabase: Client, prescription_id: str, new_status: str
) -> dict | None:
    """Update the status of a prescription (Pending → Digitized → Verified)."""
    valid_statuses = ("Pending", "Digitized", "Verified")
    if new_status not in valid_statuses:
        raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")

    result = (
        supabase.table("prescriptions")
        .update({"status": new_status})
        .eq("id", prescription_id)
        .execute()
    )
    return result.data[0] if result.data else None


async def upload_prescription_image(
    supabase: Client, image_bytes: bytes, filename: str
) -> str:
    """Upload prescription image to Supabase Storage. Returns public URL."""
    # Generate unique filename
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "jpg"
    storage_path = f"prescriptions/{uuid.uuid4().hex}.{ext}"

    supabase.storage.from_("prescription-images").upload(
        path=storage_path,
        file=image_bytes,
        file_options={"content-type": f"image/{ext}"},
    )

    # Get signed URL (valid 1 year)
    signed = supabase.storage.from_("prescription-images").create_signed_url(
        storage_path, 60 * 60 * 24 * 365
    )
    return signed.get("signedURL", "") if isinstance(signed, dict) else ""


async def delete_prescription(supabase: Client, prescription_id: str) -> bool:
    """Delete a prescription record."""
    result = supabase.table("prescriptions").delete().eq("id", prescription_id).execute()
    return bool(result.data)
