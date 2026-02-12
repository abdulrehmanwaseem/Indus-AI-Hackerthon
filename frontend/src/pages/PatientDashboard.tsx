import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  IconActivity,
  IconClipboardText,
  IconSettings,
  IconArrowRight,
  IconSparkles,
  IconBrain,
  IconShieldCheck,
  IconAlertTriangle,
  IconLoader2,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getPatients } from "@/lib/api";
import type { PatientResponse } from "@/lib/api";

export function PatientDashboard() {
  const { user } = useAuth();
  const [latestPatient, setLatestPatient] = useState<PatientResponse | null>(
    null
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getPatients({ limit: 5 });
        setTotalRecords(data.total);
        if (data.patients.length > 0) {
          setLatestPatient(data.patients[0]);
        }
      } catch {
        // Silently fail for patient dashboard — data is optional
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUrgencyColor = (level?: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-amber-500";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* ─── Hero / Welcome ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-navy p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[120%] bg-primary rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/30 bg-primary/10 mb-6 uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            AI Health Companion Active
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Welcome back,{" "}
            <span className="text-primary italic">
              {user?.full_name?.split(" ")[0]}
            </span>
            .
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed font-light">
            {latestPatient?.ai_summary?.patient_friendly_summary ||
              "Your personal AI-powered health companion. Track your clinical visits, view digitized prescriptions, and monitor your wellness in real-time."}
          </p>
          <div className="flex gap-4">
            <Link to="/about">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                Learn About Tandarust AI
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ─── AI-Powered Quick Stats ─── */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-slate-100 hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <IconActivity size={24} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Wellness
              </span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-1">Health Status</h3>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <IconLoader2 size={14} className="animate-spin" /> Analyzing...
              </div>
            ) : latestPatient ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getUrgencyColor(latestPatient.urgency_level)} text-white text-[10px]`}
                  >
                    {latestPatient.urgency_level}
                  </Badge>
                  <span className="text-xs text-slate-500">Priority</span>
                </div>
                <Progress
                  value={100 - latestPatient.urgency_score}
                  className="h-1.5"
                />
                <p className="text-[11px] text-slate-400">
                  Wellness Score: {100 - latestPatient.urgency_score}/100
                </p>
              </div>
            ) : (
              <p className="text-sm text-emerald-600 font-medium">
                <IconShieldCheck size={14} className="inline mr-1" />
                No active health alerts
              </p>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-slate-100 hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <IconClipboardText size={24} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Records
              </span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-1">
              Clinical Records
            </h3>
            <p className="text-sm text-slate-500">
              <span className="text-2xl font-extrabold text-navy">
                {totalRecords}
              </span>{" "}
              record{totalRecords !== 1 ? "s" : ""} on file
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-slate-100 hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <IconSparkles size={24} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Insights
              </span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-1">AI Insights</h3>
            {latestPatient?.risk_scores &&
            latestPatient.risk_scores.length > 0 ? (
              <div className="space-y-1">
                {latestPatient.risk_scores.slice(0, 2).map((r) => (
                  <p
                    key={r.condition}
                    className="text-xs text-slate-500 flex items-center gap-1"
                  >
                    <IconAlertTriangle size={12} className="text-amber-500" />
                    {r.condition}: <span className="font-bold">{r.score}%</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No risk factors detected.
              </p>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ─── AI Summary & Quick Actions ─── */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Health Analysis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
            <IconBrain size={22} className="text-primary" />
            AI Health Analysis
          </h2>
          <Card className="p-6 border-slate-100">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <IconLoader2 size={24} className="animate-spin mr-2" /> Loading
                AI insights...
              </div>
            ) : latestPatient?.ai_summary ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-sm leading-relaxed text-navy font-medium italic">
                    "{latestPatient.ai_summary.clinical_summary_en}"
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                  dir="rtl"
                >
                  <p className="text-sm leading-relaxed text-navy">
                    {latestPatient.ai_summary.clinical_summary_ur}
                  </p>
                </div>
                {latestPatient.ai_summary.suggested_actions?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-navy mb-2 uppercase tracking-wider">
                      Recommended Next Steps
                    </h3>
                    <div className="grid gap-2">
                      {latestPatient.ai_summary.suggested_actions.map(
                        (action, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[10px] font-bold border border-slate-200">
                              {i + 1}
                            </span>
                            <span className="text-xs font-medium text-navy">
                              {action}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <IconSparkles
                  size={32}
                  className="mx-auto text-slate-300 mb-3"
                />
                <p className="text-sm text-slate-500">
                  No AI analysis available yet.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Visit a clinic to get your first AI health report.
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-navy">Quick Actions</h2>
          <div className="grid gap-4">
            <Link to="/settings" className="block">
              <Button
                variant="outline"
                className="w-full justify-between h-16 px-6 rounded-2xl group hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center gap-4">
                  <IconSettings className="text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-navy">
                    Update Health Profile
                  </span>
                </div>
                <IconArrowRight
                  size={18}
                  className="text-slate-300 group-hover:text-primary transition-colors"
                />
              </Button>
            </Link>
            <Link to="/about" className="block">
              <Button
                variant="outline"
                className="w-full justify-between h-16 px-6 rounded-2xl group hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center gap-4">
                  <IconBrain className="text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-navy">
                    About Tandarust AI
                  </span>
                </div>
                <IconArrowRight
                  size={18}
                  className="text-slate-300 group-hover:text-primary transition-colors"
                />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
