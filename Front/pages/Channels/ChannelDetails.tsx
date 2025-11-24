import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK_SIGNALS } from "@/services/mockData";
import { BarChart2, Clock, Target, Zap } from "lucide-react";
import { useGetSingleChannel } from "@/services/channel.service";
import {
  ChannelDetailsHeader,
  ChannelStatsCard,
  PerformanceChart,
  RecentSignalsTable,
  TemplatesList,
  ChannelMetadataCard,
  ChannelNotFound,
} from "@/components/channels";

const ChannelDetails: React.FC = () => {
  const { id } = useParams();
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  const signals = MOCK_SIGNALS.filter((s) => s.channelId === id);

  const { data: channel, isLoading: isChannelLoading } = useGetSingleChannel(
    id,
    {
      enabled: !!id,
    }
  );

  // Mock Performance Data
  const performanceData = [
    { day: "Mon", pnl: 120 },
    { day: "Tue", pnl: 165 },
    { day: "Wed", pnl: 140 },
    { day: "Thu", pnl: 210 },
    { day: "Fri", pnl: 190 },
    { day: "Sat", pnl: 240 },
    { day: "Sun", pnl: 280 },
  ];

  if (isChannelLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Loading channel details...</p>
      </div>
    );
  }

  if (!channel) {
    return <ChannelNotFound />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <ChannelDetailsHeader channel={channel} />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChannelStatsCard
          title="Total Signals"
          value={signals.length || 0}
          icon={Zap}
          trend={{ label: "+12 this week", value: "+12" }}
        />
        <ChannelStatsCard
          title="Win Rate"
          value="72%"
          icon={Target}
          progress={72}
        />
        <ChannelStatsCard
          title="Net PnL"
          value="+450"
          icon={BarChart2}
          subtitle="Pips (Points)"
          valueColor="emerald"
        />
        <ChannelStatsCard
          title="Last Active"
          value={(channel as any).lastActive || "Not yet"}
          icon={Clock}
          subtitle={
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500">Monitoring</span>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Performance & Signals */}
        <div className="lg:col-span-2 space-y-8">
          <PerformanceChart
            data={performanceData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <RecentSignalsTable signals={signals} />
        </div>

        {/* Sidebar: Templates & Metadata */}
        <div className="space-y-6">
          <TemplatesList channelId={id} />
          <ChannelMetadataCard
            addedOn={channel.created_at}
            sourceId={(channel as any).telegram_channel_id}
          />
        </div>
      </div>
    </div>
  );
};

export default ChannelDetails;
