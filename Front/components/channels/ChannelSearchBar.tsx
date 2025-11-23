import React from "react";
import { Search } from "lucide-react";

interface ChannelSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ChannelSearchBar: React.FC<ChannelSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search channels...",
}) => {
  return (
    <div className="relative group">
      <Search
        className="absolute left-3 top-7 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors"
        size={18}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 dark:text-white transition-all"
      />
    </div>
  );
};

export default ChannelSearchBar;
