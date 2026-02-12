// ─────────────────────────────────────────────────────────────
// API Module — Barrel Export
// ─────────────────────────────────────────────────────────────

// Types
export * from "./types";

// Client & Utilities
export { apiClient, tokenManager, getErrorMessage } from "./client";

// Auth API
export {
  login,
  register,
  refreshToken,
  getGoogleOAuthUrl,
  getCurrentUser,
  logout,
  isAuthenticated,
} from "./auth";

// Patients API
export {
  createPatient,
  getPatients,
  getPatientById,
  deletePatient,
} from "./patients";

// Prescriptions API
export {
  uploadPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescriptionStatus,
} from "./prescriptions";

// Dashboard API
export { getDashboardStats } from "./dashboard";
