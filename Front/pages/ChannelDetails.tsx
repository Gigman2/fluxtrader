import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CHANNELS, MOCK_SIGNALS, MOCK_TEMPLATES } from '../services/mockData';
import { ArrowLeft, BarChart2, Clock, Target, Zap, MoreVertical, Plus, FileText, Activity, Trash2, Edit3, ExternalLink, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Template, SignalStatus } from '../types';

const ChannelDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const channel = MOCK_CHANNELS.find(c => c.id === id);
  const signals = MOCK_SIGNALS.filter(s => s.channelId === id);
  
  // Local state for templates to handle toggling
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    if (id) {
      setTemplates(MOCK_TEMPLATES.filter(t => t.channelId === id));
    }
  }, [id]);

  const toggleTemplateAutoDetect = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isAutoDetect: !t.isAutoDetect } : t
    ));
  };

  // Mock Performance Data
  const performanceData = [
    { day: 'Mon', pnl: 120 },
    { day: 'Tue', pnl: 165 },
    { day: 'Wed', pnl: 140 },
    { day: 'Thu', pnl: 210 },
    { day: 'Fri', pnl: 190 },
    { day: 'Sat', pnl: 240 },
    { day: 'Sun', pnl: 280 },
  ];

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-slate-400" size={32} />
        </div>
        <p className="text-slate-900 dark:text-white text-lg font-bold">Channel not found</p>
        <button onClick={() => navigate('/channels')} className="mt-4 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-medium">Return to Channels</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/channels')} 
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {channel.name}
                    </h1>
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full tracking-wider border ${
                        channel.status === 'connected' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900' 
                        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-900'
                    }`}>
                        {channel.status}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-mono mt-1">
                    <span>{channel.username}</span>
                    <ExternalLink size={12} className="opacity-50 hover:opacity-100 cursor-pointer" />
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button className="hidden sm:flex px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors items-center gap-2 shadow-sm">
                <Activity size={16} />
                Sync History
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <MoreVertical size={20} />
            </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Signals</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{channel.signalCount}</p>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    <Zap size={18} />
                </div>
             </div>
             <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Activity size={12} /> +12 this week
             </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">72%</p>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Target size={18} />
                </div>
             </div>
             <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }}></div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Net PnL</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+450</p>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <BarChart2 size={18} />
                </div>
             </div>
             <div className="text-xs text-slate-500 dark:text-slate-400">
                Pips (Points)
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Last Active</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{channel.lastActive}</p>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                    <Clock size={18} />
                </div>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500">Monitoring</span>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Main Column: Performance & Signals */}
         <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Activity size={16} className="text-slate-400" />
                        Performance Trend
                    </h3>
                    <select className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none text-slate-700 dark:text-slate-300">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} vertical={false} />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#10b981' }}
                            />
                            <Area type="monotone" dataKey="pnl" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPnl)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Signals Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Signals</h3>
                    <div className="flex gap-2">
                         <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Filter size={16} />
                         </button>
                         <button onClick={() => navigate('/signals')} className="text-xs font-bold text-slate-900 dark:text-white hover:underline px-2 py-1">View All</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Symbol</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Entry</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Time</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {signals.length > 0 ? signals.map(signal => (
                                <tr key={signal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                    <td className="px-5 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                            signal.type.includes('BUY') || signal.type.includes('LONG')
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900'
                                            : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-900'
                                        }`}>
                                            {signal.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{signal.symbol}</span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{signal.entry}</span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <span className="text-xs text-slate-500">{new Date(signal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                         <span className={`text-xs font-medium ${
                                            signal.status === 'WON' ? 'text-emerald-600 dark:text-emerald-400' : 
                                            signal.status === 'LOST' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                                         }`}>
                                            {signal.status}
                                         </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">No signals recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
         </div>

         {/* Sidebar: Templates */}
         <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <FileText size={16} className="text-slate-500" />
                        Templates
                    </h3>
                    <button onClick={() => navigate('/templates')} className="p-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg transition-colors shadow-sm">
                        <Plus size={16} />
                    </button>
                </div>
                
                <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                    {templates.length > 0 ? templates.map(template => (
                        <div key={template.id} className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                     <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500">
                                        <FileText size={14} />
                                     </div>
                                     <h4 className="font-bold text-slate-900 dark:text-white text-sm">{template.name}</h4>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"><Edit3 size={14} /></button>
                                    <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3 py-2 px-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                <span className={`text-xs font-bold flex items-center gap-1.5 ${template.isAutoDetect ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
                                    <CheckCircle size={12} className={template.isAutoDetect ? "fill-emerald-100 dark:fill-emerald-900" : "opacity-0"} />
                                    {template.isAutoDetect ? "Auto-Detect On" : "Auto-Detect Off"}
                                </span>
                                <button 
                                    onClick={() => toggleTemplateAutoDetect(template.id)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${template.isAutoDetect ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                >
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${template.isAutoDetect ? 'translate-x-5' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {template.fields.map(field => (
                                        <span key={field.id} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium rounded border border-slate-200 dark:border-slate-700">
                                            {field.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            <FileText className="mx-auto mb-2 text-slate-300" size={24} />
                            <p className="text-xs text-slate-500 mb-3">No templates configured for this channel.</p>
                            <button onClick={() => navigate('/templates')} className="text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                                Create Template
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Channel Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Metadata</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/50">
                        <span className="text-slate-500">Added On</span>
                        <span className="font-mono text-slate-900 dark:text-slate-200">Oct 24, 2023</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/50">
                        <span className="text-slate-500">Source ID</span>
                        <span className="font-mono text-slate-900 dark:text-slate-200 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">10029384</span>
                    </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-slate-500">Parsing Mode</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Strict</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChannelDetails;