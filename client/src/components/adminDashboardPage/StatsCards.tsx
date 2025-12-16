import { motion } from "framer-motion";
import { Users, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardStats } from "../../api/admin";

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

interface StatCardConfig {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

const STAT_CONFIGS: StatCardConfig[] = [
  {
    key: "pendingVerifications",
    label: "Pending Verifications",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    key: "approvedBarangays",
    label: "Approved Barangays",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "rejectedRequests",
    label: "Rejected Requests",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    key: "totalSKOfficials",
    label: "Total SK Officials",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {STAT_CONFIGS.map((config, index) => (
        <motion.div
          key={config.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {config.label}
            </p>
            {isLoading ? (
              <div className="flex items-center h-9">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">
                {stats ? stats[config.key] : 0}
              </p>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${config.bg}`}
          >
            <config.icon className={`w-6 h-6 ${config.color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
