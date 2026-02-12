import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  IconUsers,
  IconAlertTriangle,
  IconClock,
  IconFileText,
  IconChevronRight,
  IconUrgent,
  IconArrowUp,
  IconArrowDown,
  IconLoader2,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, getPatients } from "@/lib/api";
import type { DashboardStats, PatientResponse } from "@/lib/api";

const urgencyColors: Record<string, string> = {
  Critical: "bg-destructive/70 text-destructive-foreground",
  High: "bg-orange-500 text-white dark:text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-emerald-500 text-white",
};

const urgencyBorder: Record<string, string> = {
  Critical: "border-l-destructive",
  High: "border-l-orange-500",
  Medium: "border-l-amber-500",
  Low: "border-l-emerald-500",
};

const getStatsConfig = (stats: DashboardStats | null) => [
  {
    label: "Total Patients",
    value: stats?.total_patients ?? 0,
    icon: IconUsers,
    color: "text-primary",
    bg: "bg-primary/10",
    trend: "+3 today",
    trendUp: true,
  },
  {
    label: "Critical Cases",
    value: stats?.critical_patients ?? 0,
    icon: IconUrgent,
    color: "text-destructive",
    bg: "bg-destructive/10",
    trend: "+1 urgent",
    trendUp: true,
  },
  {
    label: "Pending Reviews",
    value: stats?.pending_reviews ?? 0,
    icon: IconFileText,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    trend: "-2 from yesterday",
    trendUp: false,
  },
  {
    label: "Avg Wait Time",
    value: stats?.avg_wait_time ?? "0 min",
    icon: IconClock,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    trend: "5min faster",
    trendUp: false,
  },
];

// Helper to get urgency level from risk score
const getUrgencyLevel = (score: number): string => {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function DoctorDashboard() {
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
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsConfig = getStatsConfig(stats);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-4">
          <IconLoader2 className="animate-spin text-primary" size={32} />
          <span className="ml-2 text-muted-foreground">
            Loading dashboard...
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
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Real-time patient queue and AI insights
            </p>
          </div>
          <Link to="/patient-input">
            <Button className="gap-2">
              <IconUsers size={16} /> New Patient
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsConfig.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-4 border-border/60 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs ${
                    stat.trendUp ? "text-destructive" : "text-emerald-600"
                  }`}
                >
                  {stat.trendUp ? (
                    <IconArrowUp size={12} />
                  ) : (
                    <IconArrowDown size={12} />
                  )}
                  {stat.trend}
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Queue */}
        <div className="lg:col-span-2">
          <Card className="border-border/60 overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <IconUsers size={18} className="text-primary" />
                Patient Queue
              </h2>
              <Badge variant="secondary" className="text-xs">
                {patients.length} patients
              </Badge>
            </div>
            <div className="divide-y divide-border/40">
              {patients.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <IconUsers size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No patients in queue</p>
                  <Link to="/patient-input">
                    <Button variant="link" className="mt-2">
                      Add your first patient
                    </Button>
                  </Link>
                </div>
              ) : (
                patients.map((patient, i) => {
                  const urgencyLevel = getUrgencyLevel(patient.urgency_score);
                  return (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                    >
                      <Link
                        to={`/patient/${patient.id}`}
                        className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-l-4 ${
                          urgencyBorder[urgencyLevel]
                        }`}
                      >
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarFallback className="bg-muted text-foreground text-xs font-bold">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">
                              {patient.name}
                            </p>
                            <Badge
                              className={`text-[10px] px-1.5 py-0 ${
                                urgencyColors[urgencyLevel]
                              }`}
                            >
                              {urgencyLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {patient.symptoms}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1">
                            <Progress
                              value={patient.urgency_score}
                              className="w-16 h-1.5"
                            />
                            <span className="text-xs font-mono font-medium w-7 text-right">
                              {patient.urgency_score}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {patient.age} yrs • {patient.gender}
                          </p>
                        </div>
                        <IconChevronRight
                          size={16}
                          className="text-muted-foreground shrink-0"
                        />
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Risk Alerts Sidebar */}
        <div className="space-y-4">
          <Card className="border-border/60 overflow-hidden">
            <div className="p-4 border-b border-border/60">
              <h2 className="font-semibold flex items-center gap-2">
                <IconAlertTriangle size={18} className="text-destructive" />
                Risk Alerts
              </h2>
            </div>
            <div className="divide-y divide-border/40">
              {patients.filter((p) => p.urgency_score >= 60).length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No high-risk patients
                </div>
              ) : (
                patients
                  .filter((p) => p.urgency_score >= 60)
                  .map((patient) => {
                    const urgencyLevel = getUrgencyLevel(patient.urgency_score);
                    return (
                      <Link
                        key={patient.id}
                        to={`/patient/${patient.id}`}
                        className="block p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`text-[10px] ${
                              urgencyColors[urgencyLevel]
                            }`}
                          >
                            {urgencyLevel}
                          </Badge>
                          <span className="text-sm font-medium">
                            {patient.name}
                          </span>
                        </div>
                        {patient.risk_scores?.slice(0, 2).map((risk) => (
                          <div
                            key={risk.condition}
                            className="flex items-center justify-between text-xs text-muted-foreground mt-1.5"
                          >
                            <span>{risk.condition}</span>
                            <span className="font-mono font-medium">
                              {risk.score}%
                            </span>
                          </div>
                        ))}
                      </Link>
                    );
                  })
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 border-border/60">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/patient-input">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <IconUsers size={14} /> Add Patient
                </Button>
              </Link>
              <Link to="/prescriptions">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <IconFileText size={14} /> Scan Prescription
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
