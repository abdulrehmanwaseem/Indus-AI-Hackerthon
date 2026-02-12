import { apiClient } from "./client";
import type {
  PatientCreateRequest,
  PatientResponse,
  PatientListResponse,
  PaginationParams,
} from "./types";

// ─────────────────────────────────────────────────────────────
// Patients API Module
// ─────────────────────────────────────────────────────────────

/**
 * Create a new patient with symptoms — triggers AI prioritization & risk analysis
 */
export async function createPatient(
  data: PatientCreateRequest,
): Promise<PatientResponse> {
  const response = await apiClient.post<PatientResponse>("/patients", data);
  return response.data;
}

/**
 * Get all patients (with pagination)
 */
export async function getPatients(
  params?: PaginationParams,
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
  patientId: string,
): Promise<PatientResponse> {
  const response = await apiClient.get<PatientResponse>(
    `/patients/${patientId}`,
  );
  return response.data;
}

/**
 * Delete a patient by ID
 */
export async function deletePatient(patientId: string): Promise<void> {
  await apiClient.delete(`/patients/${patientId}`);
}
