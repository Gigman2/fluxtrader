import React from "react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  step = "1",
  min,
  max,
  prefix,
  suffix,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const numValue = parseFloat(e.target.value);
            onChange(isNaN(numValue) ? undefined : numValue);
          }}
          placeholder={placeholder}
          required={required}
          step={step}
          min={min}
          max={max}
          className={`block w-full ${prefix ? "pl-7" : "pl-4"} ${
            suffix ? "pr-12" : "pr-4"
          } py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white font-mono`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-slate-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberInput;
