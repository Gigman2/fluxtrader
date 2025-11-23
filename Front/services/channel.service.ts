import useGet, { customOptions } from "@/api/query";
import { UseQueryOptions } from "@tanstack/react-query";

export interface Channel {
  id: string;
  name: string;
  status: string;
  connection_status: "connected" | "disconnected" | "error";
  connection_error?: string;
  signal_count: number;
  last_active_at: string;
  telegram_channel_id: string;
  created_at: string;
  updated_at: string;
}

export const useGetAccountChannels = (options: { status?: string }) => {
  const { data, isLoading } = useGet<Channel[]>("accounts/channels", {
    queryParams: options,
  });

  return {
    data: data,
    isLoading,
  };
};

export const useGetSingleChannel = (
  channelId: string,
  options: Omit<
    UseQueryOptions<Channel, unknown, Channel, readonly unknown[]>,
    "queryKey"
  > &
    customOptions
) => {
  const { data, isLoading } = useGet<Channel>(`channels/${channelId}`, options);

  return {
    data: data,
    isLoading,
  };
};
