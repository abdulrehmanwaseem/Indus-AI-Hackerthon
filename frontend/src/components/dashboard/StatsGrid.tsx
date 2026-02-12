import { motion } from "motion/react";
import {
  IconUsers,
  IconClock,
  IconFileText,
  IconUrgent,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import type { DashboardStats as DashboardStatsType } from "@/lib/api";

interface StatsGridProps {
  stats: DashboardStatsType | null;
  t: (key: string) => string;
}

const getStatsConfig = (stats: DashboardStatsType | null, t: any) => [
  {
    label: t("total_patients"),
    value: stats?.total_patients ?? 0,
    icon: IconUsers,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: t("critical_cases"),
    value: stats?.critical_patients ?? 0,
    icon: IconUrgent,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: t("pending_reviews"),
    value: stats?.pending_reviews ?? 0,
    icon: IconFileText,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: t("avg_wait_time"),
    value: stats?.avg_wait_time ?? "0 min",
    icon: IconClock,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export function StatsGrid({ stats, t }: StatsGridProps) {
  const statsConfig = getStatsConfig(stats, t);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className="p-4 border-border/60 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
            <p className="text-2xl font-bold text-navy">{stat.value}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
