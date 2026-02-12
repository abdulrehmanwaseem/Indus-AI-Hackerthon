import { Link } from "react-router-dom";
import {
  IconAlertTriangle,
  IconUsers,
  IconFileText,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PatientResponse } from "@/lib/api";

interface RiskAlertsProps {
  patients: PatientResponse[];
  t: (key: string) => string;
}

const urgencyColors: Record<string, string> = {
  Critical: "bg-destructive/70 text-destructive-foreground",
  High: "bg-orange-500 text-white dark:text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-emerald-500 text-white",
};

const getUrgencyLevel = (score: number): string => {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

export function RiskAlerts({ patients, t }: RiskAlertsProps) {
  const highRiskPatients = patients.filter((p) => p.urgency_score >= 60);

  return (
    <div className="space-y-4">
      <Card className="border-border/60 overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <h2 className="font-semibold flex items-center gap-2">
            <IconAlertTriangle size={18} className="text-destructive" />
            {t("high_risk_alerts")}
          </h2>
        </div>
        <div className="divide-y divide-border/40">
          {highRiskPatients.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No high-risk patients
            </div>
          ) : (
            highRiskPatients.map((patient) => {
              const urgencyLevel = getUrgencyLevel(patient.urgency_score);
              return (
                <Link
                  key={patient.id}
                  to={`/patient/${patient.id}`}
                  className="block p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={`text-[10px] ${urgencyColors[urgencyLevel]}`}
                    >
                      {urgencyLevel}
                    </Badge>
                    <span className="text-sm font-medium">{patient.name}</span>
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
        <h3 className="font-semibold text-sm mb-3">{t("quick_actions")}</h3>
        <div className="space-y-2">
          <Link to="/patient-input">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <IconUsers size={14} /> {t("new_patient")}
            </Button>
          </Link>
          <Link to="/prescriptions">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <IconFileText size={14} /> {t("scan_prescription")}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
