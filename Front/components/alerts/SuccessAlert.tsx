import React from "react";

interface SuccessAlertProps {
  message: string;
  className?: string;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div
      className={`p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 ${className}`}
    >
      {message}
    </div>
  );
};

export default SuccessAlert;
