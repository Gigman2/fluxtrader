import useGet from "@/api/query";

export interface MarketData {
  symbol: string;
  price: number;
  change_percent: number;
  change?: number;
  error?: string;
}

export const useGetMarketData = (
  symbols: string[],
  refreshInterval: number = 60000
) => {
  const { data, isLoading } = useGet<{
    success: boolean;
    data: Record<string, MarketData>;
  }>("market-data", {
    queryParams: { symbols: symbols.join(",") },
    refetchInterval: refreshInterval,
    onError: (error) => {
      console.error("Error fetching market data:", error);
    },
  });

  return {
    data: data?.data,
    isLoading,
  };
};
