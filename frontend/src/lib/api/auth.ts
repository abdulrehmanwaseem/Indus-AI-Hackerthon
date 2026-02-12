import { apiClient, tokenManager } from "./client";
import type {
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  AuthResponse,
  AuthTokens,
  UserProfile,
  OAuthURLResponse,
} from "./types";

// ─────────────────────────────────────────────────────────────
// Authentication API Module
// ─────────────────────────────────────────────────────────────

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  const { tokens } = response.data;
  tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
  return response.data;
}

/**
 * Login with email and password
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  const { tokens } = response.data;
  tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
  return response.data;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(data: RefreshRequest): Promise<AuthTokens> {
  const response = await apiClient.post<AuthTokens>("/auth/refresh", data);
  tokenManager.setTokens(
    response.data.access_token,
    response.data.refresh_token,
  );
  return response.data;
}

/**
 * Get Google OAuth URL for authentication
 */
export async function getGoogleOAuthUrl(): Promise<string> {
  const response = await apiClient.get<OAuthURLResponse>("/auth/oauth/google");
  return response.data.url;
}

/**
 * Get current authenticated user profile
 */
export async function getCurrentUser(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/auth/me");
  return response.data;
}

/**
 * Logout — clear tokens
 */
export function logout(): void {
  tokenManager.clearTokens();
}

/**
 * Check if user is authenticated (has tokens)
 */
export function isAuthenticated(): boolean {
  return tokenManager.hasTokens();
}
