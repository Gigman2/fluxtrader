import React from "react";
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  isLoading = false,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {label}{" "}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </>
      )}
    </button>
  );
};

export default SubmitButton;

