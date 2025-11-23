import React from "react";
import { Search } from "lucide-react";

interface ChannelsEmptyStateProps {
  onAddChannel: () => void;
  onClearSearch: () => void;
}

const ChannelsEmptyState: React.FC<ChannelsEmptyStateProps> = ({
  onAddChannel,
  onClearSearch,
}) => {
  return (
    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <Search size={32} />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
        No channels found
      </h3>
      <p className="text-slate-500 mt-1 max-w-xs mx-auto">
        Try adjusting your search or add a new channel to get started.
      </p>
      <button
        onClick={() => {
          onClearSearch();
          onAddChannel();
        }}
        className="mt-6 text-slate-900 dark:text-white font-medium hover:underline"
      >
        Add New Channel
      </button>
    </div>
  );
};

export default ChannelsEmptyState;

