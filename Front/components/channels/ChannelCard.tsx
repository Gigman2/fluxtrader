import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Settings,
  RefreshCw,
  ExternalLink,
  Signal,
  Clock,
} from "lucide-react";
import { Channel } from "@/types";
import ChannelStatusBadge from "./ChannelStatusBadge";

interface ChannelCardProps {
  channel: Channel;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/channels/${channel.id}`)}
      className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Status Indicator Bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          channel.status === "connected"
            ? "bg-emerald-500"
            : channel.status === "error"
            ? "bg-rose-500"
            : "bg-slate-300"
        }`}
      />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white flex items-center justify-center font-bold text-lg border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
            {channel.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
              {channel.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mt-0.5">
              @{channel.telegram_channel_id}
              <ExternalLink
                size={10}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Signal size={12} /> Signals
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {channel.signalCount || 0}
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Clock size={12} /> Last Active
          </div>
          <span className="text-sm font-medium text-slate-900 dark:text-white mt-1 block truncate">
            {channel.lastActive || "Not yet"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex-1">
          <ChannelStatusBadge
            status={channel.connection_status}
            variant="indicator"
          />
        </div>

        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/channels/${channel.id}`);
            }}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Configuration"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
            title="Sync Messages"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
