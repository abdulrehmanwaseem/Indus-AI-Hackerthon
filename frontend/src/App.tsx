import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { AuthCallback } from "@/pages/AuthCallback";
import { DoctorDashboard } from "@/pages/DoctorDashboard";
import { PatientInputPage } from "@/pages/PatientInputPage";
import { PatientSummary } from "@/pages/PatientSummary";
import { PrescriptionDigitizer } from "@/pages/PrescriptionDigitizer";
import { SettingsPage } from "@/pages/SettingsPage";
import { AboutPage } from "@/pages/AboutPage";
import { PWARegister } from "@/components/PWARegister";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

export function App() {
  return (
    <BrowserRouter>
      <PWARegister />
      <PWAInstallPrompt />
      <AuthProvider>
        <Routes>
          {/* Public pages (no sidebar) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected App pages (with sidebar layout) */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DoctorDashboard />} />
            <Route path="/patient-input" element={<PatientInputPage />} />
            <Route path="/patient/:id" element={<PatientSummary />} />
            <Route path="/prescriptions" element={<PrescriptionDigitizer />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
