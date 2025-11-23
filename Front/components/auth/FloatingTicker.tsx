import React from "react";

interface FloatingTickerProps {
  symbol: string;
  change: string;
  isPositive: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: string;
}

const FloatingTicker: React.FC<FloatingTickerProps> = ({
  symbol,
  change,
  isPositive,
  position = "top-left",
  delay = "0s",
}) => {
  const positionClasses = {
    "top-left": "top-20 left-20",
    "top-right": "top-20 right-20",
    "bottom-left": "bottom-40 left-20",
    "bottom-right": "bottom-40 right-20",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} hidden lg:block animate-float opacity-20 dark:opacity-30`}
      style={{ animationDelay: delay }}
    >
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full ${
            isPositive ? "bg-emerald-500" : "bg-rose-500"
          } animate-pulse`}
        ></div>
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
            {symbol}
          </span>
          <span
            className={`font-mono text-[10px] ${
              isPositive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {change}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FloatingTicker;

