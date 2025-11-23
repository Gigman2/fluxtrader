import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex gap-4">
        {label && (
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {label}
            </h4>
            {description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer ${
          checked
            ? "bg-slate-900 dark:bg-white"
            : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute left-0 top-0 inline-block w-6 h-6 bg-white dark:bg-slate-900 border-2 rounded-full shadow transform transition-transform ${
            checked
              ? "translate-x-3 border-slate-900 dark:border-white"
              : "translate-x-0 border-slate-300 dark:border-slate-700"
          }`}
        ></span>
      </button>
    </div>
  );
};

export default ToggleSwitch;
