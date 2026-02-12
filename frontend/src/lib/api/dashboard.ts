import { apiClient } from "./client";
import type { DashboardStats } from "./types";

// ─────────────────────────────────────────────────────────────
// Dashboard API Module
// ─────────────────────────────────────────────────────────────

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>("/dashboard/stats");
  return response.data;
}
