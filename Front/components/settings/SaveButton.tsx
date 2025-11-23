import React from "react";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  label?: string;
  className?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  isLoading = false,
  label = "Save Changes",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800
        dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white
        rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70
        disabled:cursor-not-allowed w-full
        ${isLoading ? "opacity-70 cursor-not-allowed" : ""} w-full
        ${className}
      `}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Save size={18} />
      )}
      {label}
    </button>
  );
};

export default SaveButton;
