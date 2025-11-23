import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { Channel } from "@/types";
import ChannelStatusBadge from "./ChannelStatusBadge";

interface ChannelListItemProps {
  channel: Channel;
}

const ChannelListItem: React.FC<ChannelListItemProps> = ({ channel }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/channels/${channel.id}`)}
      className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
            channel.status === "connected"
              ? "bg-slate-900 dark:bg-slate-700"
              : "bg-slate-400"
          }`}
        >
          {channel.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {channel.name}
          </h3>
          <p className="text-xs text-slate-500 font-mono">{channel.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:block text-right">
          <p className="text-xs text-slate-500 mb-0.5">Signals</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {channel.signalCount}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-slate-500 mb-0.5">Last Active</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {channel.lastActive}
          </p>
        </div>
        <div className="min-w-[100px] text-right">
          <ChannelStatusBadge status={channel.connection_status} />
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/channels/${channel.id}`);
            }}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelListItem;
