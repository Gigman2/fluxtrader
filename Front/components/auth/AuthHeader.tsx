import React from "react";
import { Zap } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  iconRotation?: number;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  iconRotation = 3,
}) => {
  return (
    <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800/50">
      <div className="flex justify-center mb-4">
        <div
          className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 shadow-lg transform hover:rotate-0 transition-transform duration-300"
          style={{ transform: `rotate(${iconRotation}deg)` }}
        >
          <Zap size={24} className="fill-current" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;

