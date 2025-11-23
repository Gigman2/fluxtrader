import React from "react";

interface ChannelStatusBadgeProps {
  status: "connected" | "disconnected" | "error";
  showLabel?: boolean;
  variant?: "badge" | "indicator";
}

const ChannelStatusBadge: React.FC<ChannelStatusBadgeProps> = ({
  status,
  showLabel = true,
  variant = "badge",
}) => {
  const statusConfig = {
    connected: {
      color: "emerald",
      label: "Receiving Signals",
      indicatorLabel: "connected",
    },
    error: {
      color: "rose",
      label: "Connection Error",
      indicatorLabel: "error",
    },
    disconnected: {
      color: "slate",
      label: "Disconnected",
      indicatorLabel: "disconnected",
    },
  };

  const config = statusConfig[status];

  if (variant === "indicator") {
    return (
      <div
        className={`flex items-center gap-2 text-xs font-medium ${
          status === "connected"
            ? "text-emerald-600 dark:text-emerald-400"
            : status === "error"
            ? "text-rose-600 dark:text-rose-400"
            : "text-slate-500"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            status === "connected"
              ? "bg-emerald-500 animate-pulse"
              : status === "error"
              ? "bg-rose-500"
              : "bg-slate-400"
          }`}
        />
        {showLabel && config.label}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        status === "connected"
          ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900"
          : status === "error"
          ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-900"
          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "connected"
            ? "bg-emerald-500"
            : status === "error"
            ? "bg-rose-500"
            : "bg-slate-400"
        }`}
      />
      {config.indicatorLabel}
    </span>
  );
};

export default ChannelStatusBadge;
