import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { IconUsers, IconChevronRight } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { PatientResponse } from "@/lib/api";

interface PatientQueueProps {
  patients: PatientResponse[];
  t: (key: string) => string;
}

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

const getUrgencyLevel = (score: number): string => {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function PatientQueue({ patients, t }: PatientQueueProps) {
  return (
    <Card className="border-border/60 overflow-hidden">
      <div className="p-4 border-b border-border/60 flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <IconUsers size={18} className="text-primary" />
          {t("patient_queue")}
        </h2>
        <Badge variant="secondary" className="text-xs">
          {patients.length} {t("patients")}
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
  );
}
