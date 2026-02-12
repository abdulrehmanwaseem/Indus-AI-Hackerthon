import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// ─────────────────────────────────────────────────────────────
// OAuth Callback Page
// Handles redirect from Supabase OAuth (Google)
// ─────────────────────────────────────────────────────────────

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { handleOAuthCallback, updateProfile } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get tokens from URL hash (Supabase sends them in hash fragment)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          // Store tokens and update auth context
          const userProfile = await handleOAuthCallback(
            accessToken,
            refreshToken
          );

          // Check for role intent
          const roleIntent = localStorage.getItem("auth_role_intent");

          // Role Stickiness: Only upgrade to 'doctor' if intent is 'doctor' and current role is 'patient'
          // We don't allow downgrading a 'doctor' to a 'patient' via simple tab selection
          if (roleIntent === "doctor" && userProfile.role === "patient") {
            try {
              await updateProfile({ role: roleIntent });
            } catch (err) {
              console.error("Failed to sync role intent:", err);
            }
          }
          localStorage.removeItem("auth_role_intent");

          // Redirect based on role
          const finalRole = roleIntent || userProfile.role;
          if (finalRole === "doctor") {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true }); // Both go to /dashboard, App.tsx handles the component
          }
        } else {
          // Check for error
          const errorDesc =
            hashParams.get("error_description") || "Authentication failed";
          setError(errorDesc);
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Failed to complete authentication");
      }
    };

    processCallback();
  }, [navigate, handleOAuthCallback]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-bg">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">
            Authentication Failed
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}
