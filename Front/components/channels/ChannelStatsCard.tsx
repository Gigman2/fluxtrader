import React from "react";
import { LucideIcon, Activity } from "lucide-react";

interface ChannelStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string | React.ReactNode;
  progress?: number;
  trend?: {
    label: string;
    value: string;
  };
  valueColor?: "default" | "emerald";
}

const ChannelStatsCard: React.FC<ChannelStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  progress,
  trend,
  valueColor = "default",
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <p
            className={`text-2xl font-bold ${
              valueColor === "emerald"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {value}
          </p>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          <Icon size={18} />
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {subtitle && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {subtitle}
        </div>
      )}
      {trend && (
        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
          <Activity size={12} /> {trend.label}
        </div>
      )}
    </div>
  );
};

export default ChannelStatsCard;

