import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { useAuth } from "@/contexts/AuthContext";

import { ASSETS } from "@/lib/assets";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"clinic" | "patient">("clinic");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Get the redirect path (if user was sent here from a protected route)
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const onSubmit = async (data: LoginFormValues) => {
    clearError();
    try {
      await login({ email: data.email, password: data.password });
      navigate(from, { replace: true });
    } catch {
      // Error is handled by AuthContext
    }
  };

  const handleGoogleLogin = async () => {
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
              src={ASSETS.IMAGES.HERO}
            />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your Digital Partner in Modern Healthcare.
          </h1>
          <p className="text-slate-400 text-lg">
            Streamlining clinics and empowering patients with AI-driven clinical
            precision and accessible care tools.
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

      {/* ─── Right Panel (login form) ─── */}
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
              <h2 className="text-2xl font-bold text-navy">Welcome Back</h2>
              <p className="text-slate-500 text-sm mt-1">
                Please enter your details to sign in
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
                    htmlFor="email"
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
                  id="email"
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
                    htmlFor="password"
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
                    id="password"
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

              <div className="flex items-center justify-between text-sm w-full py-2">
                <Field orientation="horizontal" className="gap-2">
                  <Checkbox id="remember-me" />
                  <FieldLabel
                    htmlFor="remember-me"
                    className="text-slate-600 font-normal cursor-pointer hover:text-navy transition-colors"
                  >
                    Remember me
                  </FieldLabel>
                </Field>
                <div className="w-full flex justify-end">
                  <a
                    href="#"
                    className="text-primary font-medium hover:underline"
                  >
                    Forgot password?
                  </a>
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
                  "Sign In"
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
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              <img
                alt="Google"
                className="w-5 h-5"
                src={ASSETS.IMAGES.GOOGLE_ICON}
              />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-slate-500 mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-bold hover:underline"
              >
                Register
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
