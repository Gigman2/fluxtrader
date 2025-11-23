import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity, 
  Download, 
  Filter,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// --- Mock Data ---

const EQUITY_DATA = [
  { date: 'Nov 01', balance: 10000 },
  { date: 'Nov 03', balance: 10150 },
  { date: 'Nov 05', balance: 10080 },
  { date: 'Nov 07', balance: 10320 },
  { date: 'Nov 09', balance: 10450 },
  { date: 'Nov 11', balance: 10400 },
  { date: 'Nov 13', balance: 10680 },
  { date: 'Nov 15', balance: 10850 },
  { date: 'Nov 17', balance: 10750 },
  { date: 'Nov 19', balance: 11100 },
  { date: 'Nov 21', balance: 11050 },
  { date: 'Nov 23', balance: 11400 },
];

const SYMBOL_PERFORMANCE = [
  { name: 'XAUUSD', pnl: 850, trades: 15 },
  { name: 'BTCUSD', pnl: 520, trades: 8 },
  { name: 'US30', pnl: 320, trades: 6 },
  { name: 'EURUSD', pnl: -120, trades: 10 },
  { name: 'GBPJPY', pnl: -80, trades: 4 },
];

const WIN_LOSS_DATA = [
  { name: 'Wins', value: 28, color: '#10b981' }, // Emerald-500
  { name: 'Losses', value: 14, color: '#f43f5e' }, // Rose-500
  { name: 'Breakeven', value: 5, color: '#64748b' }, // Slate-500
];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | 'YTD'>('30D');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 shadow-xl text-xs">
          <p className="font-bold mb-1 text-slate-300">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-mono">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Performance metrics and account health.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
            {['7D', '30D', '3M', 'YTD'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <DollarSign size={20} />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} className="mr-1" /> +14%
                </span>
            </div>
            <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Profit</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">+$1,400.00</h3>
            </div>
        </div>

        {/* Profit Factor */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                    <Activity size={20} />
                </div>
                <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    Good
                </span>
            </div>
            <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Profit Factor</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">2.45</h3>
            </div>
        </div>

        {/* Win Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <Target size={20} />
                </div>
            </div>
            <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Win Rate</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">68.4%</h3>
            </div>
        </div>

        {/* Total Trades */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                    <TrendingUp size={20} />
                </div>
                <span className="text-xs font-bold text-slate-500">Last 30 days</span>
            </div>
            <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Trades</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">47</h3>
            </div>
        </div>
      </div>

      {/* Main Equity Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-96">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equity Curve</h3>
                <p className="text-xs text-slate-500">Cumulative PnL over selected period</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+$1,400</p>
                <p className="text-xs text-slate-500">Total Return</p>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={EQUITY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value}`}
                dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Performance by Asset */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-80">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance by Symbol</h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart 
                    layout="vertical" 
                    data={SYMBOL_PERFORMANCE} 
                    margin={{ top: 0, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        width={60}
                    />
                    <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                    <Bar dataKey="pnl" radius={[0, 4, 4, 0]} barSize={20}>
                        {SYMBOL_PERFORMANCE.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Win/Loss Ratio */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-80">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Trade Outcomes</h3>
             <div className="flex items-center justify-center h-full pb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={WIN_LOSS_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {WIN_LOSS_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            verticalAlign="middle" 
                            align="right" 
                            layout="vertical"
                            iconType="circle"
                            iconSize={8}
                            formatter={(value, entry: any) => <span className="text-slate-600 dark:text-slate-300 text-sm font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;