import React, { useState } from "react";
import { MOCK_SIGNALS, MOCK_CHANNELS } from "@/services/mockData";
import { SignalStatus } from "../types";
import {
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Zap,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import MarketTicker from "@/components/MarketTicker";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatusBadge: React.FC<{ status: SignalStatus }> = ({ status }) => {
  const styles = {
    [SignalStatus.ACTIVE]:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    [SignalStatus.PENDING]:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    [SignalStatus.WON]:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    [SignalStatus.LOST]:
      "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    [SignalStatus.CANCELLED]:
      "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 border-slate-200 dark:border-slate-700",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

// Mock Equity Data for Chart
const equityData = [
  { time: "00:00", value: 10000 },
  { time: "04:00", value: 10150 },
  { time: "08:00", value: 10120 },
  { time: "12:00", value: 10350 },
  { time: "16:00", value: 10420 },
  { time: "20:00", value: 10580 },
  { time: "24:00", value: 10580 },
];

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<string>("ALL");
  const [highConfidenceOnly, setHighConfidenceOnly] = useState(false);

  const getChannelName = (id: string) =>
    MOCK_CHANNELS.find((c) => c.id === id)?.name || "Unknown";

  const filteredSignals = MOCK_SIGNALS.filter((s) => {
    const statusMatch = filter === "ALL" || s.status === filter;
    const confidenceMatch = highConfidenceOnly ? s.confidence > 0.9 : true;
    return statusMatch && confidenceMatch;
  });

  // Simulate progress for active signals (0 to 100%)
  const getSignalProgress = (signal: any) => {
    if (signal.status !== SignalStatus.ACTIVE) return 0;
    // Random mock progress for demo purposes
    return Math.floor(Math.random() * 80) + 10;
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Market Context */}
      <MarketTicker symbols={["XAUUSD", "BTCUSD", "EURUSD", "GBPJPY"]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Overview of your trading activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <RefreshCw size={18} />
          </button>
          <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm font-medium"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value={SignalStatus.ACTIVE}>Active</option>
              <option value={SignalStatus.PENDING}>Pending</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Stats & Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total PnL
              </span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <div>
              <span className="text-2xl font-bold">+420</span>
              <span className="text-sm text-slate-400 ml-1">pips</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                Active
              </span>
              <Zap size={16} className="text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              12
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                Win Rate
              </span>
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              68%
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                Confidence
              </span>
              <Zap size={16} className="text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              99%
            </div>
          </div>
        </div>

        {/* Equity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Equity Growth (24h)
            </h3>
            <span className="text-xs text-emerald-500 font-medium">+5.8%</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.1}
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1e293b",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Signals Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Recent Signals
          </h3>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={highConfidenceOnly}
                onChange={(e) => setHighConfidenceOnly(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              High Confidence (&#62;90%)
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Signal
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Price Info
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  R:R
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredSignals.map((signal) => (
                <tr
                  key={signal.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-[10px] shadow-sm ${
                          signal.type.includes("BUY") ||
                          signal.type.includes("LONG")
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      >
                        {signal.type.includes("BUY") ||
                        signal.type.includes("LONG")
                          ? "B"
                          : "S"}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          {signal.symbol}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(signal.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {getChannelName(signal.channelId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-xs font-mono text-slate-900 dark:text-slate-200">
                        @ {signal.entry}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        TP: {signal.tp[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 w-48">
                    {signal.status === SignalStatus.ACTIVE ? (
                      <div className="w-full">
                        <div className="flex justify-between text-[10px] mb-1 text-slate-500">
                          <span>Entry</span>
                          <span>TP1</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-900 dark:bg-slate-200 rounded-full"
                            style={{ width: `${getSignalProgress(signal)}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`text-xs font-medium ${
                          signal.status === "WON"
                            ? "text-emerald-500"
                            : signal.status === "LOST"
                            ? "text-rose-500"
                            : "text-slate-400"
                        }`}
                      >
                        {signal.pnl
                          ? `${signal.pnl > 0 ? "+" : ""}${signal.pnl} pips`
                          : "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-mono text-slate-500">
                    1:2.5
                  </td>
                  <td className="px-6 py-4 text-right">
                    <StatusBadge status={signal.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSignals.length === 0 && (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <AlertCircle
              className="mx-auto mb-4 text-slate-300 dark:text-slate-600"
              size={48}
            />
            <p>No signals found matching current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
