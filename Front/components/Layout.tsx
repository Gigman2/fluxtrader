import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, Bell } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col w-full max-w-[100vw] overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
             <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;