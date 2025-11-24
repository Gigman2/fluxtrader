import React, { useState, useMemo } from "react";
import { useGetAccountChannels } from "@/services/channel.service";
import {
  ChannelsHeader,
  ChannelCard,
  ChannelListItem,
  ChannelsEmptyState,
  AddChannelModal,
} from "@/components/channels";

const Channels: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: channels, isLoading } = useGetAccountChannels({});

  const filteredChannels = useMemo(() => {
    console.log(channels);
    if (!channels) return [];

    return channels?.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, channels]);

  return (
    <div className="space-y-6">
      <ChannelsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddChannel={() => setModalOpen(true)}
      />

      {isLoading ? (
        <div className="text-center py-20">
          <p className="text-slate-500">Loading channels...</p>
        </div>
      ) : filteredChannels.length === 0 ? (
        <ChannelsEmptyState
          onAddChannel={() => setModalOpen(true)}
          onClearSearch={() => setSearchQuery("")}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredChannels.map((channel) => (
              <ChannelListItem key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      )}

      <AddChannelModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Channels;
