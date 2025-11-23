import React from "react";
import useGet from "@/api/query";
import { RefreshCw } from "lucide-react";
import { useGetMarketData } from "@/services/market-data.service";

interface MarketTickerItemProps {
  symbol: string;
  price: number;
  change: number;
  isLoading?: boolean;
}

const MarketTickerItem: React.FC<MarketTickerItemProps> = ({
  symbol,
  price,
  change,
  isLoading = false,
}) => {
  const formatPrice = (price: number, symbol: string): string => {
    if (symbol === "BTCUSD") {
      return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
    } else if (symbol === "EURUSD") {
      return price.toFixed(4);
    } else if (symbol === "XAUUSD") {
      return price.toFixed(2);
    } else {
      return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm min-w-[120px]">
      <span className="font-bold text-xs text-slate-900 dark:text-white">
        {symbol}
      </span>
      {isLoading ? (
        <RefreshCw size={12} className="animate-spin text-slate-400" />
      ) : (
        <>
          <span className="font-mono text-xs text-slate-500">
            {formatPrice(price, symbol)}
          </span>
          <span
            className={`text-[10px] font-medium ${
              change >= 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
        </>
      )}
    </div>
  );
};

interface MarketTickerProps {
  symbols?: string[];
  refreshInterval?: number;
}

const MarketTicker: React.FC<MarketTickerProps> = ({
  symbols = ["XAUUSD", "BTCUSD", "EURUSD", "GBPJPY"],
  refreshInterval = 60000, // 1 minute default
}) => {
  const { data, isLoading } = useGetMarketData(symbols, refreshInterval);

  const marketData = data || {};

  return (
    <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
      {symbols.map((symbol) => {
        const symbolData = marketData[symbol];

        if (symbolData?.error) {
          return (
            <div
              key={symbol}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm min-w-[120px]"
            >
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {symbol}
              </span>
              <span className="text-[10px] text-rose-500">Error</span>
            </div>
          );
        }

        return (
          <MarketTickerItem
            key={symbol}
            symbol={symbol}
            price={symbolData?.price || 0}
            change={symbolData?.change_percent || 0}
            isLoading={isLoading && !symbolData}
          />
        );
      })}
    </div>
  );
};

export default MarketTicker;
