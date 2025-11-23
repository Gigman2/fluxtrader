import React from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import { Signal } from "@/types";

interface RecentSignalsTableProps {
  signals: Signal[];
  onViewAll?: () => void;
}

const RecentSignalsTable: React.FC<RecentSignalsTableProps> = ({
  signals,
  onViewAll,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Recent Signals
        </h3>
        <div className="flex gap-2">
          <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Filter size={16} />
          </button>
          <button
            onClick={() => onViewAll?.() || navigate("/signals")}
            className="text-xs font-bold text-slate-900 dark:text-white hover:underline px-2 py-1"
          >
            View All
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Entry
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Time
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {signals.length > 0 ? (
              signals.map((signal) => (
                <tr
                  key={signal.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        signal.type.includes("BUY") || signal.type.includes("LONG")
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900"
                          : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-900"
                      }`}
                    >
                      {signal.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {signal.symbol}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                      {signal.entry}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs text-slate-500">
                      {new Date(signal.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`text-xs font-medium ${
                        signal.status === "WON"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : signal.status === "LOST"
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-slate-500"
                      }`}
                    >
                      {signal.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-500 text-sm"
                >
                  No signals recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSignalsTable;

