import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';

// Deterministic candle data for background pattern
const CANDLES = Array.from({ length: 40 }).map((_, i) => {
  // varying trend
  const trend = Math.sin(i * 0.2) * 100;
  const volatility = (Math.cos(i * 0.5) + 1) * 20;
  
  const open = 150 + trend + (Math.sin(i) * volatility);
  const close = open + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 40);
  const high = Math.max(open, close) + Math.random() * 15;
  const low = Math.min(open, close) - Math.random() * 15;
  const isBullish = close > open;
  
  return { open, close, high, low, isBullish };
});

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <style>{`
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Moving Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-emerald-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 animate-gradient-xy opacity-80"></div>

      {/* Candlestick Chart Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-[0.07] pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[200%] h-64 -translate-y-1/2 flex animate-marquee">
          {/* First Set */}
          <div className="w-1/2 h-full flex items-end justify-around px-4">
             {CANDLES.map((candle, i) => (
                <div key={`c1-${i}`} className="relative w-2 mx-1" style={{ height: '100%' }}>
                    {/* Wick */}
                    <div 
                        className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${candle.isBullish ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ 
                            bottom: `${candle.low}px`, 
                            height: `${candle.high - candle.low}px`,
                        }} 
                    />
                    {/* Body */}
                    <div 
                        className={`absolute left-0 w-full rounded-sm ${candle.isBullish ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ 
                            bottom: `${Math.min(candle.open, candle.close)}px`, 
                            height: `${Math.abs(candle.close - candle.open)}px`,
                        }}
                    />
                </div>
             ))}
          </div>
          {/* Duplicate Set for Seamless Loop */}
          <div className="w-1/2 h-full flex items-end justify-around px-4">
             {CANDLES.map((candle, i) => (
                <div key={`c2-${i}`} className="relative w-2 mx-1" style={{ height: '100%' }}>
                    <div 
                        className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${candle.isBullish ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ 
                            bottom: `${candle.low}px`, 
                            height: `${candle.high - candle.low}px`,
                        }} 
                    />
                    <div 
                        className={`absolute left-0 w-full rounded-sm ${candle.isBullish ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ 
                            bottom: `${Math.min(candle.open, candle.close)}px`, 
                            height: `${Math.abs(candle.close - candle.open)}px`,
                        }}
                    />
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
           style={{
             backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(to right, #64748b 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}
      ></div>

      {/* Floating Tickers (Decorative) */}
      <div className="absolute top-20 left-20 hidden lg:block animate-float opacity-20 dark:opacity-30">
         <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">EURUSD</span>
                <span className="font-mono text-[10px] text-emerald-500">+0.45%</span>
            </div>
         </div>
      </div>
      <div className="absolute bottom-40 right-20 hidden lg:block animate-float opacity-20 dark:opacity-30" style={{ animationDelay: '2s' }}>
         <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
             <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">XAUUSD</span>
                <span className="font-mono text-[10px] text-rose-500">-1.20%</span>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300 z-10 relative">
        
        {/* Header */}
        <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Zap size={24} className="fill-current" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">SignalFlux</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Professional Trading Intelligence</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                  placeholder="trader@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-medium text-slate-900 dark:text-white hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-slate-900 dark:text-white hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="fixed bottom-6 text-center w-full text-xs text-slate-400 z-10">
        &copy; 2024 SignalFlux. All rights reserved.
      </div>
    </div>
  );
};

export default Login;