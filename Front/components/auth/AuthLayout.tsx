import React from "react";
import AuthBackground, { TickerConfig } from "./AuthBackground";
import AuthPageFooter from "./AuthPageFooter";

interface AuthLayoutProps {
  children: React.ReactNode;
  tickers?: TickerConfig[];
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, tickers }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <AuthBackground tickers={tickers} />
      {children}
      <AuthPageFooter />
    </div>
  );
};

export default AuthLayout;
