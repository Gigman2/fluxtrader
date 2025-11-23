import React from "react";
import { format } from "date-fns";

interface ChannelMetadataCardProps {
  addedOn?: string;
  sourceId?: string;
  parsingMode?: string;
}

const ChannelMetadataCard: React.FC<ChannelMetadataCardProps> = ({
  addedOn = "Oct 24, 2023",
  sourceId,
  parsingMode = "Strict",
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        Metadata
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/50">
          <span className="text-slate-500">Added On</span>
          <span className="font-mono text-slate-900 dark:text-slate-200">
            {format(new Date(addedOn), "MMM d, yyyy")}
          </span>
        </div>
        {sourceId && (
          <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/50">
            <span className="text-slate-500">Source ID</span>
            <span className="font-mono text-slate-900 dark:text-slate-200 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {sourceId}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelMetadataCard;
