// ─────────────────────────────────────────────────────────────
// API Types — Matching Backend Pydantic Models
// ─────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// AUTH TYPES
// ═══════════════════════════════════════════════════════════════

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: "doctor" | "patient" | "admin";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at?: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface OAuthURLResponse {
  url: string;
}

// ═══════════════════════════════════════════════════════════════
// PATIENT TYPES
// ═══════════════════════════════════════════════════════════════

export interface RiskScore {
  condition: string;
  score: number;
  level?: "Low" | "Medium" | "High" | "Critical";
}

export interface Vitals {
  blood_pressure: string;
  heart_rate: number;
  temperature: number;
  oxygen_saturation: number;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
}

export interface PatientCreateRequest {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  symptoms: string;
  medical_history?: string;
  vitals?: Vitals;
}

export interface PatientResponse {
  id: string;
  name: string;
  age: number;
  gender: string;
  symptoms: string;
  urgency_score: number;
  urgency_level?: "Low" | "Medium" | "High" | "Critical";
  wait_time?: string;
  avatar?: string;
  history?: string[];
  medical_history?: string;
  risk_scores?: RiskScore[];
  ai_summary?: string;
  treatment_plan?: string;
  vitals?: Vitals;
  medications?: Medication[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface PatientListResponse {
  patients: PatientResponse[];
  total: number;
}

// ═══════════════════════════════════════════════════════════════
// PRESCRIPTION TYPES
// ═══════════════════════════════════════════════════════════════

export interface PrescriptionMedication {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionStatusUpdate {
  status: "Pending" | "Digitized" | "Verified";
}

export interface PrescriptionResponse {
  id: string;
  patient_name: string;
  date: string;
  medications: PrescriptionMedication[];
  status: "Pending" | "Digitized" | "Verified";
  image_url?: string;
  created_at?: string;
}

export interface PrescriptionListResponse {
  prescriptions: PrescriptionResponse[];
  total: number;
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD TYPES
// ═══════════════════════════════════════════════════════════════

export interface DashboardStats {
  total_patients: number;
  critical_patients: number;
  pending_reviews: number;
  avg_wait_time: string;
  prescriptions_today: number;
  risk_alerts: number;
}

// ═══════════════════════════════════════════════════════════════
// API ERROR TYPES
// ═══════════════════════════════════════════════════════════════

export interface APIError {
  detail: string | { message: string; [key: string]: unknown };
}

// ═══════════════════════════════════════════════════════════════
// PAGINATION TYPES
// ═══════════════════════════════════════════════════════════════

export interface PaginationParams {
  limit?: number;
  offset?: number;
}
