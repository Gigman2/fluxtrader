import React, { useState } from 'react';
import { 
  Shield, 
  Smartphone, 
  Activity, 
  Save, 
  Terminal, 
  Key, 
  Lock, 
  DollarSign, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Server
} from 'lucide-react';

type TabId = 'trading' | 'integrations' | 'security';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('trading');
  
  // Mock States
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPerTrade, setRiskPerTrade] = useState(1.5);
  const [showPassword, setShowPassword] = useState(false);
  const [mtStatus, setMtStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [telegramStatus, setTelegramStatus] = useState<'connected' | 'disconnected'>('connected');

  const tabs = [
    { id: 'trading', label: 'Trading Info', icon: <Activity size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Terminal size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  const renderTradingTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="text-slate-900 dark:text-white" size={20} />
          Risk Management Defaults
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          These values are used to automatically calculate position sizes in the signal dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Account Balance (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value))}
                className="block w-full pl-7 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Risk Per Trade (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(parseFloat(e.target.value))}
                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white font-mono"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
               <h4 className="text-sm font-medium text-slate-900 dark:text-white">Max Drawdown Warning</h4>
               <p className="text-xs text-slate-500 mt-1">Alert when daily loss exceeds threshold</p>
            </div>
            <div className="w-24">
               <input
                type="number"
                defaultValue={5}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-center focus:ring-2 focus:ring-slate-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg font-medium transition-colors shadow-sm">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Telegram */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Telegram Bot</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive and parse signals directly from your channels.</p>
                </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                telegramStatus === 'connected' 
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900' 
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}>
                {telegramStatus === 'connected' ? 'Connected' : 'Not Connected'}
            </div>
        </div>

        {telegramStatus === 'connected' ? (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs font-bold">JD</div>
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">@johndoe_trader</p>
                        <p className="text-xs text-slate-500">Connected since Oct 24, 2023</p>
                    </div>
                </div>
                <button 
                    onClick={() => setTelegramStatus('disconnected')}
                    className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                >
                    Disconnect
                </button>
            </div>
        ) : (
            <button 
                onClick={() => setTelegramStatus('connected')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
                <MessageSquare size={18} />
                Connect Telegram Account
            </button>
        )}
      </div>

      {/* MetaTrader */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200">
                    <Server size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">MetaTrader 4/5</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect your broker account for trade execution.</p>
                </div>
            </div>
             <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                mtStatus === 'connected' 
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900' 
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}>
                {mtStatus === 'connected' ? 'Connected' : 'Not Connected'}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Platform</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white">
                    <option>MetaTrader 5</option>
                    <option>MetaTrader 4</option>
                    <option>cTrader</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Broker Server</label>
                <input type="text" placeholder="e.g. ICMarkets-Demo" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Login ID</label>
                <input type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white" 
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>
        </div>

        <div className="flex justify-end">
            <button 
                onClick={() => setMtStatus(prev => prev === 'connected' ? 'disconnected' : 'connected')}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg font-medium transition-colors"
            >
                {mtStatus === 'connected' ? 'Update Connection' : 'Connect Broker'}
            </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Key className="text-slate-900 dark:text-white" size={20} />
            Password & Authentication
        </h3>
        
        <div className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                <input type="password" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                <input type="password" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white" />
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                <input type="password" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white" />
            </div>
            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Update Password
            </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400 h-fit">
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-slate-900 dark:bg-white">
                    <span className="absolute left-0 inline-block w-6 h-6 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-full shadow transform translate-x-6 transition-transform"></span>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="text-slate-900 dark:text-white" size={20} />
                API Keys
            </h3>
            <button className="text-sm text-slate-900 dark:text-white font-medium hover:underline">Generate New Key</button>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                    <Key size={16} />
                </div>
                <div>
                    <p className="text-sm font-mono text-slate-900 dark:text-white">sk_live_...9f2a</p>
                    <p className="text-xs text-slate-500">Created 2 days ago</p>
                </div>
            </div>
            <button className="text-rose-500 hover:text-rose-600 text-xs font-medium">Revoke</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account, integrations, and trading preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <nav className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'trading' && renderTradingTab()}
          {activeTab === 'integrations' && renderIntegrationsTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;