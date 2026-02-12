import { apiClient } from "./client";
import type {
  PrescriptionResponse,
  PrescriptionListResponse,
  PrescriptionStatusUpdate,
  PaginationParams,
} from "./types";

// ─────────────────────────────────────────────────────────────
// Prescriptions API Module
// ─────────────────────────────────────────────────────────────

/**
 * Upload and digitize a prescription image
 * Uses FormData for file upload
 */
export async function uploadPrescription(
  file: File,
  patientName: string,
  patientId?: string,
): Promise<PrescriptionResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("patient_name", patientName);
  if (patientId) {
    formData.append("patient_id", patientId);
  }

  const response = await apiClient.post<PrescriptionResponse>(
    "/prescriptions/digitize",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
}

/**
 * Get all prescriptions (with pagination)
 */
export async function getPrescriptions(
  params?: PaginationParams,
): Promise<PrescriptionListResponse> {
  const response = await apiClient.get<PrescriptionListResponse>(
    "/prescriptions",
    {
      params: {
        limit: params?.limit ?? 50,
        offset: params?.offset ?? 0,
      },
    },
  );
  return response.data;
}

/**
 * Get a single prescription by ID
 */
export async function getPrescriptionById(
  prescriptionId: string,
): Promise<PrescriptionResponse> {
  const response = await apiClient.get<PrescriptionResponse>(
    `/prescriptions/${prescriptionId}`,
  );
  return response.data;
}

/**
 * Update prescription status
 */
export async function updatePrescriptionStatus(
  prescriptionId: string,
  status: PrescriptionStatusUpdate,
): Promise<PrescriptionResponse> {
  const response = await apiClient.patch<PrescriptionResponse>(
    `/prescriptions/${prescriptionId}/status`,
    status,
  );
  return response.data;
}
