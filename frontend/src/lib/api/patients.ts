import { apiClient } from "./client";
import type {
  PatientCreateRequest,
  PatientResponse,
  PatientListResponse,
  PaginationParams,
  VoiceTranscriptionResponse,
} from "./types";

// ─────────────────────────────────────────────────────────────
// Patients API Module
// ─────────────────────────────────────────────────────────────

/**
 * Create a new patient with symptoms — triggers AI prioritization & risk analysis
 */
export async function createPatient(
  data: PatientCreateRequest
): Promise<PatientResponse> {
  const response = await apiClient.post<PatientResponse>("/patients", data);
  return response.data;
}

/**
 * Get all patients (with pagination)
 */
export async function getPatients(
  params?: PaginationParams
): Promise<PatientListResponse> {
  const response = await apiClient.get<PatientListResponse>("/patients", {
    params: {
      limit: params?.limit ?? 50,
      offset: params?.offset ?? 0,
    },
  });
  return response.data;
}

/**
 * Get a single patient by ID
 */
export async function getPatientById(
  patientId: string
): Promise<PatientResponse> {
  const response = await apiClient.get<PatientResponse>(
    `/patients/${patientId}`
  );
  return response.data;
}

/**
 * Delete a patient by ID
 */
export async function deletePatient(patientId: string): Promise<void> {
  await apiClient.delete(`/patients/${patientId}`);
}

/**
 * Transcribe and extract patient data from audio file
 */
export async function transcribeVoice(
  audioBlob: Blob
): Promise<VoiceTranscriptionResponse> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");

  const response = await apiClient.post<VoiceTranscriptionResponse>(
    "/patients/transcribe-voice",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}
