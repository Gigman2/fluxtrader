import useGet, { customOptions } from "@/api/query";
import { IAppResponse } from "@/interfaces/misc.interface";
import { UseQueryOptions } from "@tanstack/react-query";

interface IRiskSettings {
  account_balance: number;
  risk_per_trade: number;
  max_drawdown: number;
}

export const useGetRiskSettings = (
  options: Omit<UseQueryOptions<IRiskSettings, unknown>, "queryKey"> &
    customOptions = {}
) => {
  const endpoint = `risk/settings`;
  const { data, error, isLoading, isError, ...rest } = useGet<IRiskSettings>(
    endpoint,
    {
      ...options,
      authenticate: true,
      contentType: "application/json",
    }
  );
  return { data, error, isLoading, isError, ...rest };
};
