import React, { useState, useMemo } from "react";
import { MOCK_SIGNALS, MOCK_CHANNELS } from "../services/mockData";
import { Signal, SignalStatus, SignalType } from "../types";
import {
  Search,
  Filter,
  Calculator,
  X,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Target,
  ShieldAlert,
} from "lucide-react";

const Signals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  // Calculator State
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1.0);

  // Filter logic
  const filteredSignals = useMemo(() => {
    return MOCK_SIGNALS.filter((signal) => {
      const matchesSearch =
        signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        MOCK_CHANNELS.find((c) => c.id === signal.channelId)
          ?.name.toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  // Helper to get channel name
  const getChannelName = (id: string) =>
    MOCK_CHANNELS.find((c) => c.id === id)?.name || "Unknown";

  // Calculations
  const metrics = useMemo(() => {
    if (!selectedSignal) return null;

    const { entry, sl, tp, symbol } = selectedSignal;

    // Heuristic for Pips/Points calculation
    let multiplier = 1;
    let type = "Points";

    if (symbol.includes("JPY")) {
      multiplier = 100;
      type = "Pips";
    } else if (symbol.includes("XAU") || symbol.includes("GOLD")) {
      multiplier = 10;
      type = "Pips";
    } else if (
      ["BTC", "ETH", "US30", "NAS100", "SPX", "GBPJPY"].some((s) =>
        symbol.includes(s)
      )
    ) {
      multiplier = 1;
      type = "Points";
    } else {
      // Standard Forex
      multiplier = 10000;
      type = "Pips";
    }

    const slDistAbs = Math.abs(entry - sl);
    const slPips = slDistAbs * multiplier;

    // Calculate TP pips for the first TP
    const tpDistAbs = Math.abs(tp[0] - entry);
    const tpPips = tpDistAbs * multiplier;

    const riskAmount = accountBalance * (riskPercentage / 100);

    // Position Size (Units) = Risk Amount / SL Distance (Price difference)
    // Note: This assumes the account currency matches the quote currency (approx) for simplicity in this UI
    // or that 1 unit movement = 1 unit of currency.
    // For Forex: Standard Lot = 100,000 units.

    const units = slDistAbs > 0 ? riskAmount / slDistAbs : 0;

    // Estimate Lots (Standard)
    const lots = units / 100000;

    return {
      slPips: slPips.toFixed(1),
      tpPips: tpPips.toFixed(1),
      riskAmount: riskAmount.toFixed(2),
      units: units.toFixed(2),
      lots: lots.toFixed(2),
      rrRatio: (tpDistAbs / slDistAbs).toFixed(2),
      type,
    };
  }, [selectedSignal, accountBalance, riskPercentage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Live Signals
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Review and trade active signals.
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search symbol or channel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white w-full sm:w-64"
          />
        </div>
      </div>

      {/* Signals List */}
      <div className="grid gap-4">
        {filteredSignals.map((signal) => (
          <div
            key={signal.id}
            onClick={() => setSelectedSignal(signal)}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-white font-bold text-xs shadow-sm ${
                    signal.type === SignalType.BUY ||
                    signal.type === SignalType.LONG
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                  }`}
                >
                  <span className="text-[10px] opacity-90">{signal.type}</span>
                  <span className="text-sm">
                    {signal.symbol.replace("USD", "")}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {signal.symbol}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium">
                      {getChannelName(signal.channelId)}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(signal.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-slate-500">Entry</p>
                  <p className="font-mono font-medium text-slate-900 dark:text-white">
                    {signal.entry}
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-slate-500">Status</p>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      signal.status === SignalStatus.ACTIVE
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : signal.status === SignalStatus.PENDING
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {signal.status}
                  </span>
                </div>
                <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors" />
              </div>
            </div>
          </div>
        ))}

        {filteredSignals.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Filter className="mx-auto mb-2 opacity-50" size={32} />
            <p>No signals found.</p>
          </div>
        )}
      </div>

      {/* Trade Calculator Modal */}
      {selectedSignal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-950">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                      selectedSignal.type.includes("BUY") ||
                      selectedSignal.type.includes("LONG")
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                    }`}
                  >
                    {selectedSignal.type}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedSignal.symbol}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Signal by{" "}
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getChannelName(selectedSignal.channelId)}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedSignal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Price Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Entry
                    </div>
                    <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                      {selectedSignal.entry}
                    </div>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30 text-center relative overflow-hidden">
                    <div className="text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider font-semibold mb-1 flex items-center justify-center gap-1">
                      <ShieldAlert size={12} /> Stop Loss
                    </div>
                    <div className="text-xl font-mono font-bold text-rose-700 dark:text-rose-400">
                      {selectedSignal.sl}
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold mb-1 flex items-center justify-center gap-1">
                      <Target size={12} /> Take Profit 1
                    </div>
                    <div className="text-xl font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {selectedSignal.tp[0]}
                    </div>
                  </div>
                </div>

                {/* Calculator Section */}
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-bold text-lg">
                    <Calculator
                      className="text-slate-900 dark:text-white"
                      size={20}
                    />
                    Position Calculator
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2 uppercase">
                        Account Balance
                      </label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="number"
                          value={accountBalance}
                          onChange={(e) =>
                            setAccountBalance(parseFloat(e.target.value) || 0)
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2 uppercase">
                        Risk Percentage
                      </label>
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                          %
                        </span>
                        <input
                          type="number"
                          value={riskPercentage}
                          step="0.1"
                          onChange={(e) =>
                            setRiskPercentage(parseFloat(e.target.value) || 0)
                          }
                          className="w-full pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  {metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Risk Amount
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">
                          ${metrics.riskAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Stop Loss ({metrics.type})
                        </p>
                        <p className="font-bold text-rose-600 dark:text-rose-400 text-lg">
                          {metrics.slPips}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Reward/Risk
                        </p>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                          1:{metrics.rrRatio}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Est. Position
                        </p>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white text-lg">
                            {metrics.units} Units
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ~{metrics.lots} Lots
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Original Message Preview */}
                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  <div className="text-slate-500 mb-2 font-sans text-[10px] uppercase font-bold tracking-wider">
                    Original Message
                  </div>
                  {selectedSignal.originalMessage}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-3">
              <button
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                onClick={() => {
                  alert("Trade Execution Not Implemented");
                }}
              >
                <TrendingUp size={20} />
                Place Trade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signals;
