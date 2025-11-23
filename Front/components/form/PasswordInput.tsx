import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  showForgotPassword?: boolean;
  forgotPasswordLink?: string;
  helperText?: React.ReactNode;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  showForgotPassword = false,
  forgotPasswordLink = "#",
  helperText,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        {showForgotPassword && (
          <a
            href={forgotPasswordLink}
            className="text-xs font-medium text-slate-900 dark:text-white hover:underline"
          >
            Forgot Password?
          </a>
        )}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Lock size={18} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {helperText && <div className="mt-1.5 ml-1">{helperText}</div>}
    </div>
  );
};

export default PasswordInput;
