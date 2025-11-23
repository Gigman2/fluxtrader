import React from "react";
import { LucideIcon } from "lucide-react";

interface SettingsCardProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  icon: Icon,
  description,
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm ${className}`}
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        {Icon && <Icon className="text-slate-900 dark:text-white" size={20} />}
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

export default SettingsCard;

