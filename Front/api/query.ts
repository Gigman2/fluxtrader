import { useEffect } from "react";
import {
  UseQueryOptions,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

import fetchData from "./fetch";

export interface customOptions {
  id?: string;
  queryParams?: any;
  enabled?: boolean;
  authenticate?: boolean;
  contentType?: string;
  component?: string;
  queryKey?: string[];
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
}

/**
 * USAGE
 * const { isLoading, data } = useGet('/api/users/:id', {
 *      id: '1',     // Optional
 *      enabled: true // Optional
 *      authenticate: true // Optional
 *      contentType: 'application/json' // Optional
 *      queryKey: ['users', 'users:1'] // Optional
 *      onError: (error) => {
 *          console.log(error)
 *      }
 *      onSuccess: (data) => {
 *          console.log(data)
 *      }
 *  });
 */

function useGet<T>(
  urlTemplate: string,
  options: Omit<UseQueryOptions<T, unknown>, "queryKey"> & customOptions = {}
): UseQueryResult<T, unknown> {
  const { id, queryParams, onError, onSuccess, component, ...restOptions } =
    options;

  const url = id ? urlTemplate.replace(":id", id) : urlTemplate;
  const queryKey = [url, queryParams, ...(options.queryKey || [])];

  const queryResult = useQuery<T, unknown>({
    queryKey,
    queryFn: async (context) => {
      return fetchData<T>({
        queryKey: context.queryKey,
        authenticate: restOptions.authenticate,
        contentType: restOptions.contentType,
      });
    },
    enabled: options.enabled !== undefined ? options.enabled : true, // Default to true if not provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    retry: (failureCount, error: any) => {
      // Stop retrying if the error is a 404
      if (error.response?.status === 404) {
        return false;
      }

      // Stop retrying for network errors
      if (!error.response || error.message === "Network Error") {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: 5000,
    ...restOptions,
  });

  // Handle onSuccess and onError callbacks (removed from useQuery in v5)
  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data && onSuccess) {
      onSuccess(queryResult.data);
    }
  }, [queryResult.isSuccess, queryResult.data, onSuccess]);

  useEffect(() => {
    if (queryResult.isError && queryResult.error) {
      onError?.(queryResult.error);
    }
  }, [queryResult.isError, queryResult.error, onError]);

  return queryResult;
}

export default useGet;
