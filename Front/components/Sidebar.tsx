import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileJson, 
  BarChart3, 
  Settings,
  Zap,
  Radio,
  X,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/signals', icon: <Radio size={20} />, label: 'Signals' },
    { to: '/channels', icon: <MessageSquare size={20} />, label: 'Channels' },
    { to: '/templates', icon: <FileJson size={20} />, label: 'Templates' },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const baseClass = "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col";
  const mobileClass = isOpen ? "translate-x-0" : "-translate-x-full";

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`${baseClass} ${mobileClass}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Zap size={24} className="fill-current" />
            <span className="text-lg font-bold tracking-tight">SignalFlux</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-500 hover:bg-slate-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-rose-500 transition-colors duration-200 text-sm font-medium mb-4"
          >
            <LogOut size={20} />
            Log Out
          </button>

          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">John Doe</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;