import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const HERO_IMG = "/hero.jpg";
const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAThH8ZlSEQ3ij-ciG6WBPo_-6E8bLfaJIJ9iudYpn7vwrILktXElieHVx8U-F-rvE_-EzSZmNQay6GkvrtGm36M3_oq97rEsx8e9P5h0K06fQKjP-JEie7ms-aiwq_zdBypP9zFbKq9JPsycjiopYAAh8tXIll3hA1l-v-eCv1jgqfXDsmMfmwA9Gfcmw6sabOh2-kscDIYaG2LLHDnDyrBHJB1YvcLycz6oqLAfMwS9eUgUucKVl2UHdgXARIS42I1qCAUt8FPScu",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDdDnPDwxrVY6qJRPG_nl0Lrl-hYBcw87qf5C-YdOaertpZyIEcaNo-H0q_dAQRoQeoSQFixkd_FyJS9y8hjLpkE3kDcUpHpYrNQG3ID6oue4z26KFd7-XVKplmzVc-wCX4ubDHTnB84VJy1HP8hSc0LxLr2hvFru8fozvJV1dF4WXkSsfB0gPL0u_1nwDDblHResA2t7XVCPNMaa8InIFzqzFIQWjBhf6-LXTiCTDdg2QxZsI6SiYPScvCfqdxoeXegUQgiZ3sdGon",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJPB5QDWmuFzKI9KWJEqrtmqRWTQol_TWwp7QvQXPb2E4rTuNPPnQ8tYXeRNSizRuGYWkIywxlGxjPf0bhb5j6MZBBBagI9AISVpokJvtNptDKl3EDWDPclTO3NuBTe3_XItpE0upBwuKBpIomrg4_Wq-uCEaFtL_8YwepITx9GQz-J3eEHlzFAPNagVesF7mmALX_Mr0MQAKgunrtY_5pPTZ08bzI0-OOhR_viVf_3yZyQdfnOJFQKAeEF-wEmwdDN6BWgwQZowHV",
];

const GOOGLE_ICON = "/google-icon.png";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"clinic" | "patient">("clinic");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({
        email,
        password,
        full_name: name,
        role: activeTab === "clinic" ? "doctor" : "patient",
      });
      navigate("/dashboard", { replace: true });
    } catch {
      // Error is handled by AuthContext
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* ─── Left Panel (navy branding) ─── */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy relative items-center justify-center p-12 overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Hero image */}
          <div className="mb-8">
            <img
              alt="Doctor with AI assistant"
              className="rounded-2xl shadow-2xl border border-white/10 w-full aspect-video object-cover"
              src={HERO_IMG}
            />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join the Future of Intelligent Healthcare.
          </h1>
          <p className="text-slate-400 text-lg">
            Create your account and start transforming patient care with
            AI-powered diagnostics, smart triage, and digital prescriptions.
          </p>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                <img
                  key={i}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-navy object-cover"
                  src={src}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500">
              Joined by 500+ medical professionals
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right Panel (register form) ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white lg:bg-slate-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <Link
            to="/"
            className="lg:hidden flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity"
          >
            <img
              src="/brand-logo.png"
              alt="Tandarust AI"
              className="h-10 w-auto"
            />
          </Link>
          <div className="bg-white p-8 lg:rounded-2xl lg:shadow-xl lg:border border-slate-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy">Create Account</h2>
              <p className="text-slate-500 text-sm mt-1">
                Register to start using Tandarust AI
              </p>
            </div>

            {/* Clinic / Patient tabs */}
            <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
              <button
                type="button"
                onClick={() => setActiveTab("clinic")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "clinic"
                    ? "bg-white text-navy shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-navy"
                }`}
              >
                Clinic
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("patient")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "patient"
                    ? "bg-white text-navy shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-navy"
                }`}
              >
                Patient
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </Label>
                  <span className="urdu-hint">مکمل نام</span>
                </div>
                <Input
                  id="name"
                  placeholder="Dr. Ahmed Khan"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label
                    htmlFor="reg-email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </Label>
                  <span className="urdu-hint">ای میل ایڈریس</span>
                </div>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label
                    htmlFor="reg-password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </Label>
                  <span className="urdu-hint">پاس ورڈ</span>
                </div>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <IconEyeOff size={18} />
                    ) : (
                      <IconEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 mt-2 h-12"
              >
                {isLoading ? (
                  <IconLoader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              <img alt="Google" className="w-5 h-5" src={GOOGLE_ICON} />
              Sign up with Google
            </button>

            <p className="text-center text-sm text-slate-500 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Bottom links */}
          <div className="flex justify-center gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary">
              Help Center
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
