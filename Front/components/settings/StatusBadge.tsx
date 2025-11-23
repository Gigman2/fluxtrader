import React from "react";

interface StatusBadgeProps {
  status: "connected" | "disconnected" | string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const isConnected = status === "connected";

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-medium border ${className} ${
        isConnected
          ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900"
          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
      }`}
    >
      {isConnected ? "Connected" : "Not Connected"}
    </div>
  );
};

export default StatusBadge;

