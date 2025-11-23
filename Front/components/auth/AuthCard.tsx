import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300 z-10 relative ${className}`}
    >
      {children}
    </div>
  );
};

export default AuthCard;

