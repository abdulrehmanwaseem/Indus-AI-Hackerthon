import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  IconArrowLeft,
  IconHeartbeat,
  IconAlertTriangle,
  IconPill,
  IconBrain,
  IconUser,
  IconCalendar,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getPatientById } from "@/lib/api";
import type { PatientResponse } from "@/lib/api";

const urgencyColors: Record<string, string> = {
  Critical: "bg-destructive text-destructive-foreground dark:text-white",
  High: "bg-orange-500 text-white dark:text-white",
  Medium: "bg-amber-500 text-white dark:text-white",
  Low: "bg-emerald-500 text-white dark:text-white",
};

const riskColors: Record<string, string> = {
  Critical: "text-destructive",
  High: "text-orange-500",
  Medium: "text-amber-500",
  Low: "text-emerald-500",
};

// Helper function to get urgency level from score
const getUrgencyLevel = (score: number): string => {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

// Helper to get risk level from score
const getRiskLevel = (score: number): string => {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Medium";
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

export function PatientSummary() {
  const { id } = useParams();
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setError("Patient ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getPatientById(id);
        setPatient(data);
      } catch (err) {
        console.error("Failed to fetch patient:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load patient data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 mb-4 -ml-2"
          disabled
        >
          <IconArrowLeft size={16} /> Back to Dashboard
        </Button>
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </Card>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-4 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full mb-3" />
            ))}
          </Card>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1.5 mb-4 -ml-2">
            <IconArrowLeft size={16} /> Back to Dashboard
          </Button>
        </Link>
        <Card className="p-8 text-center">
          <IconAlertTriangle
            className="mx-auto text-destructive mb-4"
            size={48}
          />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Patient</h2>
          <p className="text-muted-foreground mb-4">
            {error || "Patient not found"}
          </p>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const urgencyLevel = getUrgencyLevel(patient.urgency_score);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link to="/dashboard">
        <Button variant="ghost" size="sm" className="gap-1.5 mb-4 -ml-2">
          <IconArrowLeft size={16} /> Back to Dashboard
        </Button>
      </Link>

      {/* Patient Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 border-border/60 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="w-16 h-16 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{patient.name}</h1>
                <Badge className={urgencyColors[urgencyLevel]}>
                  {urgencyLevel} Priority
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <IconUser size={14} /> {patient.age}y, {patient.gender}
                </span>
                <span className="flex items-center gap-1">
                  <IconHeartbeat size={14} /> Score: {patient.urgency_score}/100
                </span>
                <span className="flex items-center gap-1">
                  <IconCalendar size={14} /> ID: {patient.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-border/60 h-full">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <IconBrain size={18} className="text-primary" />
              AI-Generated Treatment Plan
            </h2>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm leading-relaxed text-foreground">
                {patient.treatment_plan || "AI analysis pending..."}
              </p>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-medium mb-2">Symptoms Reported</h3>
              <p className="text-sm text-muted-foreground">
                {patient.symptoms}
              </p>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-medium mb-2">Medical History</h3>
              <div className="flex flex-wrap gap-2">
                {patient.medical_history ? (
                  patient.medical_history.split(",").map((h) => (
                    <Badge
                      key={h.trim()}
                      variant="secondary"
                      className="text-xs"
                    >
                      {h.trim()}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No medical history recorded
                  </span>
                )}
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-medium mb-2">Vitals</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">
                  Blood Pressure:{" "}
                  <span className="text-foreground">
                    {patient.vitals?.blood_pressure || "N/A"}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  Heart Rate:{" "}
                  <span className="text-foreground">
                    {patient.vitals?.heart_rate || "N/A"} bpm
                  </span>
                </span>
                <span className="text-muted-foreground">
                  Temperature:{" "}
                  <span className="text-foreground">
                    {patient.vitals?.temperature || "N/A"}°F
                  </span>
                </span>
                <span className="text-muted-foreground">
                  O₂ Sat:{" "}
                  <span className="text-foreground">
                    {patient.vitals?.oxygen_saturation || "N/A"}%
                  </span>
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Risk Scores */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-border/60 h-full">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <IconAlertTriangle size={18} className="text-destructive" />
              Risk Assessment
            </h2>
            <div className="space-y-5">
              {patient.risk_scores && patient.risk_scores.length > 0 ? (
                patient.risk_scores.map((risk, i) => {
                  const riskLevel = getRiskLevel(risk.score);
                  return (
                    <motion.div
                      key={risk.condition}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">
                          {risk.condition}
                        </span>
                        <span
                          className={`text-sm font-bold ${riskColors[riskLevel]}`}
                        >
                          {risk.score}%
                        </span>
                      </div>
                      <Progress value={risk.score} className="h-2" />
                      <p
                        className={`text-xs mt-1 font-medium ${
                          riskColors[riskLevel]
                        }`}
                      >
                        {riskLevel} Risk
                      </p>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No risk assessment data available
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Medications */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/60 overflow-hidden">
            <div className="p-4 border-b border-border/60">
              <h2 className="font-semibold flex items-center gap-2">
                <IconPill size={18} className="text-chart-1" />
                Medications
              </h2>
            </div>
            {patient.medications && patient.medications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 text-xs text-muted-foreground">
                      <th className="text-left p-3 font-medium">Medication</th>
                      <th className="text-left p-3 font-medium">Dosage</th>
                      <th className="text-left p-3 font-medium">Frequency</th>
                      <th className="text-left p-3 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.medications.map((med, i) => (
                      <tr key={i} className="border-b border-border/20 text-sm">
                        <td className="p-3 font-medium">{med.name}</td>
                        <td className="p-3 text-muted-foreground">
                          {med.dosage}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {med.frequency}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {med.duration || "As prescribed"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No medications prescribed yet.
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
