import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { IconUsers, IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
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
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Queue */}
        <div className="lg:col-span-2">
          <PatientQueue patients={patients} t={t} />
        </div>

        {/* Risk Alerts Sidebar */}
        <RiskAlerts patients={patients} t={t} />
      </div>
    </div>
  );
}
