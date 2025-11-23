import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, MoreVertical, ExternalLink } from "lucide-react";
import { Channel } from "@/types";
import ChannelStatusBadge from "./ChannelStatusBadge";

interface ChannelDetailsHeaderProps {
  channel: Channel;
}

const ChannelDetailsHeader: React.FC<ChannelDetailsHeaderProps> = ({
  channel,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/channels")}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {channel.name}
            </h1>
            <ChannelStatusBadge status={channel.connection_status} />
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-mono mt-1">
            <span>
              {(channel as any).telegram_channel_id || channel.username}
            </span>
            <ExternalLink
              size={12}
              className="opacity-50 hover:opacity-100 cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="hidden sm:flex px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors items-center gap-2 shadow-sm">
          <Activity size={16} />
          Sync History
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChannelDetailsHeader;
