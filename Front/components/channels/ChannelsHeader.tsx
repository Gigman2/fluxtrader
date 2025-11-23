import React from "react";
import { Plus } from "lucide-react";
import ChannelSearchBar from "./ChannelSearchBar";
import ViewModeToggle from "./ViewModeToggle";

interface ChannelsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onAddChannel: () => void;
}

const ChannelsHeader: React.FC<ChannelsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onAddChannel,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Channels
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your signal sources.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <ChannelSearchBar value={searchQuery} onChange={onSearchChange} />
        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        <button
          onClick={onAddChannel}
          className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Channel
        </button>
      </div>
    </div>
  );
};

export default ChannelsHeader;

