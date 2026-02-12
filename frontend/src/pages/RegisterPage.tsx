import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ASSETS } from "@/lib/assets";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register: apiRegister,
    loginWithGoogle,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"clinic" | "patient">("clinic");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    clearError();
    try {
      await apiRegister({
        email: data.email,
        password: data.password,
        full_name: data.name,
        role: activeTab === "clinic" ? "doctor" : "patient",
      });
      navigate("/dashboard", { replace: true });
    } catch {
      // Error is handled by AuthContext
    }
  };

  const handleGoogleSignup = async () => {
    try {
      localStorage.setItem(
        "auth_role_intent",
        activeTab === "clinic" ? "doctor" : "patient"
      );
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
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <IconArrowLeft size={20} />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase">
              Back to Home
            </span>
          </Link>

          {/* Hero image */}
          <div className="mb-8">
            <img
              alt="Doctor with AI assistant"
              className="rounded-2xl shadow-2xl border border-white/10 w-full h-80 aspect-video object-cover"
              src={ASSETS.IMAGES.HERO_2}
            />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join the Future of Intelligent Healthcare.
          </h1>
          <p className="text-slate-400 text-lg">
            Create your account and start transforming patient care with
            AI-powered diagnostics, smart triage and digital prescriptions.
          </p>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {ASSETS.IMAGES.SOCIAL_AVATARS.map((src, i) => (
                <img
                  key={i}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-navy object-cover"
                  src={src}
                />
              ))}
            </div>
            <p className="text-sm text-slate-400">
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
              src={ASSETS.IMAGES.BRAND_LOGO}
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
            {(error || Object.keys(form.formState.errors).length > 0) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                {error && <p className="text-sm text-red-600 mb-1">{error}</p>}
                {Object.entries(form.formState.errors).map(([field, err]) => (
                  <p key={field} className="text-sm text-red-600">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label
                    htmlFor="name"
                    className={`text-sm font-medium ${
                      form.formState.errors.name
                        ? "text-red-600"
                        : "text-slate-700"
                    }`}
                  >
                    Full Name
                  </Label>
                  <span className="urdu-hint">مکمل نام</span>
                </div>
                <Input
                  id="name"
                  placeholder="Ahmed Khan"
                  {...form.register("name")}
                  className={`shadow-sm ${
                    form.formState.errors.name
                      ? "border-red-300 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label
                    htmlFor="reg-email"
                    className={`text-sm font-medium ${
                      form.formState.errors.email
                        ? "text-red-600"
                        : "text-slate-700"
                    }`}
                  >
                    Email Address
                  </Label>
                  <span className="urdu-hint">ای میل ایڈریس</span>
                </div>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  {...form.register("email")}
                  className={`shadow-sm ${
                    form.formState.errors.email
                      ? "border-red-300 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label
                    htmlFor="reg-password"
                    className={`text-sm font-medium ${
                      form.formState.errors.password
                        ? "text-red-600"
                        : "text-slate-700"
                    }`}
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
                    {...form.register("password")}
                    className={`shadow-sm pr-10 ${
                      form.formState.errors.password
                        ? "border-red-300 focus-visible:ring-red-500"
                        : ""
                    }`}
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
              <img
                alt="Google"
                className="w-5 h-5"
                src={ASSETS.IMAGES.GOOGLE_ICON}
              />
              Sign up with Google
            </button>

            <p className="text-center text-sm text-slate-500 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Login
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
