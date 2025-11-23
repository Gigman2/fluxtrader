import React from "react";
import { Activity } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface PerformanceDataPoint {
  day: string;
  pnl: number;
}

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  timeRange = "Last 7 Days",
  onTimeRangeChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Activity size={16} className="text-slate-400" />
          Performance Trend
        </h3>
        {onTimeRangeChange && (
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none text-slate-700 dark:text-slate-300"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        )}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="day"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                color: "#f8fafc",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#10b981" }}
            />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPnl)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;

