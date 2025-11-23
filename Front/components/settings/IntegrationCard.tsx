import React from "react";
import { LucideIcon } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "connected" | "disconnected";
  onConnect?: () => void;
  onDisconnect?: () => void;
  connectedContent?: React.ReactNode;
  disconnectedContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon: Icon,
  status,
  onConnect,
  onDisconnect,
  connectedContent,
  disconnectedContent,
  children,
  className = "",
}) => {
  const isConnected = status === "connected";

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200">
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {isConnected && connectedContent && (
        <div className="mb-4">{connectedContent}</div>
      )}

      {!isConnected && disconnectedContent && (
        <div className="mb-4">{disconnectedContent}</div>
      )}

      {children && <div>{children}</div>}

      {isConnected && onDisconnect && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onDisconnect}
            className="text-sm text-rose-600 hover:text-rose-700 font-medium"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default IntegrationCard;
