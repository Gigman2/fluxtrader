import React from "react";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon: LucideIcon;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icon size={18} />
        </div>
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default FormInput;
