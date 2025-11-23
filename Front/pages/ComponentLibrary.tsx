import React from 'react';
import { 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Settings, 
  ChevronRight,
  Loader2
} from 'lucide-react';

const ComponentLibrary: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Design System</h1>
        <p className="text-slate-500 dark:text-slate-400">Core UI components and style guide.</p>
      </div>

      {/* Colors */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Typography & Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-slate-900 text-white shadow-lg">
            <div className="font-bold">Slate 900</div>
            <div className="text-xs opacity-70">#0f172a</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 text-slate-900 border border-slate-200">
            <div className="font-bold">Slate 50</div>
            <div className="text-xs opacity-70">#f8fafc</div>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500 text-white shadow-lg">
            <div className="font-bold">Emerald 500</div>
            <div className="text-xs opacity-70">#10b981</div>
          </div>
          <div className="p-4 rounded-lg bg-rose-500 text-white shadow-lg">
            <div className="font-bold">Rose 500</div>
            <div className="text-xs opacity-70">#f43f5e</div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg font-bold transition-colors shadow-sm">
            Primary Action
          </button>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 text-slate-900 rounded-lg font-bold transition-colors">
            Secondary
          </button>
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors">
            Outline
          </button>
          <button className="px-4 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
            Ghost
          </button>
          <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold transition-colors shadow-sm flex items-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
          <button disabled className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-lg font-bold cursor-not-allowed flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Loading
          </button>
        </div>
      </section>

      {/* Form Inputs */}
      <section className="max-w-md">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Inputs</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default Input</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white"
              placeholder="Enter text..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Input with Icon</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white"
                placeholder="Search..."
              />
            </div>
          </div>
           <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Error State</label>
            <input 
              type="text" 
              defaultValue="Invalid Value"
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-600"
            />
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> value is required</p>
          </div>
        </div>
      </section>

      {/* Cards & Badges */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Cards & Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Zap size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Active Status</h3>
                    <p className="text-xs text-slate-500">System operational</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900">
                    Active
                 </span>
                 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900">
                    Pending
                 </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                    Inactive
                 </span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default ComponentLibrary;