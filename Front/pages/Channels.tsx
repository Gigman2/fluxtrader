import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CHANNELS } from '../services/mockData';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  LayoutList, 
  MoreVertical, 
  Settings, 
  RefreshCw, 
  ExternalLink,
  Signal,
  Clock
} from 'lucide-react';

const Channels: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter channels
  const filteredChannels = useMemo(() => {
    return MOCK_CHANNELS.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Channels</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your signal sources.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search channels..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
          
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <LayoutList size={18} />
            </button>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Channel
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredChannels.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No channels found</h3>
          <p className="text-slate-500 mt-1 max-w-xs mx-auto">Try adjusting your search or add a new channel to get started.</p>
          <button 
            onClick={() => { setSearchQuery(''); setModalOpen(true); }}
            className="mt-6 text-slate-900 dark:text-white font-medium hover:underline"
          >
            Add New Channel
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChannels.map((channel) => (
            <div 
              key={channel.id} 
              onClick={() => navigate(`/channels/${channel.id}`)}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Status Indicator Bar */}
              <div className={`absolute top-0 left-0 w-full h-1 ${channel.status === 'connected' ? 'bg-emerald-500' : channel.status === 'error' ? 'bg-rose-500' : 'bg-slate-300'}`} />

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white flex items-center justify-center font-bold text-lg border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                        {channel.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                            {channel.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mt-0.5">
                            {channel.username}
                            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Signal size={12} /> Signals
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{channel.signalCount}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Clock size={12} /> Last Active
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white mt-1 block truncate">{channel.lastActive}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                 <div className={`flex-1 flex items-center gap-2 text-xs font-medium ${
                    channel.status === 'connected' ? 'text-emerald-600 dark:text-emerald-400' : 
                    channel.status === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                 }`}>
                    <span className={`w-2 h-2 rounded-full ${
                        channel.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 
                        channel.status === 'error' ? 'bg-rose-500' : 'bg-slate-400'
                    }`} />
                    {channel.status === 'connected' ? 'Receiving Signals' : channel.status === 'error' ? 'Connection Error' : 'Disconnected'}
                 </div>

                 <div className="flex gap-1">
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/channels/${channel.id}`); }}
                        className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Configuration"
                    >
                        <Settings size={18} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        title="Sync Messages"
                    >
                        <RefreshCw size={18} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredChannels.map((channel) => (
                    <div 
                        key={channel.id}
                        onClick={() => navigate(`/channels/${channel.id}`)}
                        className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                                 channel.status === 'connected' ? 'bg-slate-900 dark:bg-slate-700' : 'bg-slate-400'
                             }`}>
                                {channel.name.charAt(0)}
                             </div>
                             <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{channel.name}</h3>
                                <p className="text-xs text-slate-500 font-mono">{channel.username}</p>
                             </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="hidden md:block text-right">
                                <p className="text-xs text-slate-500 mb-0.5">Signals</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{channel.signalCount}</p>
                            </div>
                            <div className="hidden md:block text-right">
                                <p className="text-xs text-slate-500 mb-0.5">Last Active</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{channel.lastActive}</p>
                            </div>
                            <div className="min-w-[100px] text-right">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    channel.status === 'connected' 
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900' 
                                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${channel.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                    {channel.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate(`/channels/${channel.id}`); }}
                                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    <Settings size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Add Channel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Connect Channel</h2>
                <p className="text-sm text-slate-500 mt-1">Add a new Telegram channel source.</p>
            </div>
            
            <div className="p-6">
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Channel Identifier</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-mono text-sm">@</span>
                        <input 
                            type="text" 
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all" 
                            placeholder="channel_username" 
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 ml-1">You can also use the numerical Channel ID.</p>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all" 
                        placeholder="e.g. Gold VIP Signals" 
                    />
                </div>

                <div className="pt-2 flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => setModalOpen(false)} 
                        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
                    >
                        Connect Channel
                    </button>
                </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channels;