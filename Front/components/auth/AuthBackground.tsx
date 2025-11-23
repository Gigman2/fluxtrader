import React from "react";
import FloatingTicker from "./FloatingTicker";

export interface TickerConfig {
  symbol: string;
  change: string;
  isPositive: boolean;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: string;
}

interface AuthBackgroundProps {
  tickers?: TickerConfig[];
}

// Deterministic candle data for background pattern
const CANDLES = Array.from({ length: 40 }).map((_, i) => {
  const trend = Math.sin(i * 0.2) * 100;
  const volatility = (Math.cos(i * 0.5) + 1) * 20;

  const open = 150 + trend + Math.sin(i) * volatility;
  const close = open + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 40);
  const high = Math.max(open, close) + Math.random() * 15;
  const low = Math.min(open, close) - Math.random() * 15;
  const isBullish = close > open;

  return { open, close, high, low, isBullish };
});

// Default tickers
const DEFAULT_TICKERS: TickerConfig[] = [
  {
    symbol: "EURUSD",
    change: "+0.45%",
    isPositive: true,
    position: "top-left",
  },
  {
    symbol: "XAUUSD",
    change: "-1.20%",
    isPositive: false,
    position: "bottom-right",
    delay: "2s",
  },
];

const AuthBackground: React.FC<AuthBackgroundProps> = ({
  tickers = DEFAULT_TICKERS,
}) => {
  return (
    <>
      <style>{`
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Moving Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-100 via-emerald-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 animate-gradient-xy opacity-80"></div>

      {/* Candlestick Chart Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-[0.07] pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[200%] h-64 -translate-y-1/2 flex animate-marquee">
          {/* First Set */}
          <div className="w-1/2 h-full flex items-end justify-around px-4">
            {CANDLES.map((candle, i) => (
              <div
                key={`c1-${i}`}
                className="relative w-2 mx-1"
                style={{ height: "100%" }}
              >
                {/* Wick */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-px ${
                    candle.isBullish ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{
                    bottom: `${candle.low}px`,
                    height: `${candle.high - candle.low}px`,
                  }}
                />
                {/* Body */}
                <div
                  className={`absolute left-0 w-full rounded-sm ${
                    candle.isBullish ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{
                    bottom: `${Math.min(candle.open, candle.close)}px`,
                    height: `${Math.abs(candle.close - candle.open)}px`,
                  }}
                />
              </div>
            ))}
          </div>
          {/* Duplicate Set for Seamless Loop */}
          <div className="w-1/2 h-full flex items-end justify-around px-4">
            {CANDLES.map((candle, i) => (
              <div
                key={`c2-${i}`}
                className="relative w-2 mx-1"
                style={{ height: "100%" }}
              >
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-px ${
                    candle.isBullish ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{
                    bottom: `${candle.low}px`,
                    height: `${candle.high - candle.low}px`,
                  }}
                />
                <div
                  className={`absolute left-0 w-full rounded-sm ${
                    candle.isBullish ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{
                    bottom: `${Math.min(candle.open, candle.close)}px`,
                    height: `${Math.abs(candle.close - candle.open)}px`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(to right, #64748b 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Floating Tickers */}
      {tickers.map((ticker, index) => (
        <FloatingTicker
          key={`${ticker.symbol}-${index}`}
          symbol={ticker.symbol}
          change={ticker.change}
          isPositive={ticker.isPositive}
          position={ticker.position}
          delay={ticker.delay}
        />
      ))}
    </>
  );
};

export default AuthBackground;
