import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  IconUsers,
  IconAlertTriangle,
  IconLoader2,
  IconBrain,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, getPatients } from "@/lib/api";
import type { DashboardStats, PatientResponse } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { PatientQueue } from "@/components/dashboard/PatientQueue";
import { RiskAlerts } from "@/components/dashboard/RiskAlerts";

export function DoctorDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [statsData, patientsData] = await Promise.all([
          getDashboardStats(),
          getPatients({ limit: 20 }),
        ]);

        setStats(statsData);
        setPatients(patientsData.patients);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-4">
          <IconLoader2 className="animate-spin text-primary" size={32} />
          <span className="ml-2 text-muted-foreground">
            {t("loading", "Loading dashboard...")}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full mb-2" />
            ))}
          </Card>
          <Card className="p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full mb-2" />
            ))}
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <IconAlertTriangle
            className="mx-auto text-destructive mb-4"
            size={48}
          />
          <h2 className="text-xl font-semibold mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t("doctor_dashboard")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("real_time_queue")}
            </p>
          </div>
          <Link to="/patient-input">
            <Button className="gap-2">
              <IconUsers size={16} /> {t("new_patient")}
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} t={t} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Patient Queue */}
        <div className="lg:col-span-2">
          <PatientQueue patients={patients} t={t} />
        </div>

        {/* Risk Alerts Sidebar */}
        <RiskAlerts patients={patients} t={t} />
      </div>

      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/60 bg-primary/5">
            <h2 className="font-semibold flex items-center gap-2">
              <IconBrain size={18} className="text-primary" />
              {t("ai_critical_insights", "AI Critical Insights")}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              AI-generated summaries for the highest-priority patients
            </p>
          </div>
          <div className="divide-y divide-border/40">
            {patients
              .filter((p) => p.urgency_score >= 60)
              .slice(0, 3)
              .map((patient) => (
                <Link
                  key={patient.id}
                  to={`/patient/${patient.id}`}
                  className="block p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm text-navy">
                        {patient.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {patient.age}y, {patient.gender}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        patient.urgency_score >= 80
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      Score: {patient.urgency_score}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {patient.ai_summary?.clinical_summary_en ||
                      `Symptoms: ${patient.symptoms?.slice(0, 100)}...`}
                  </p>
                  {patient.risk_scores && patient.risk_scores.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {patient.risk_scores.slice(0, 3).map((r) => (
                        <span
                          key={r.condition}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-medium"
                        >
                          {r.condition}: {r.score}%
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            {patients.filter((p) => p.urgency_score >= 60).length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No critical patients at this time. 🎉
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
