import {
  UseMutationOptions,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

import getEnv from "@/utilities/envs";

const { VITE_BASE_API_URL } = getEnv();

import { clean, toFormData, toQueryString } from "@/utilities/misc";

import client, { generateHeaders } from "./axiosClient";
import { customOptions } from "./query";

/*** USAGE
 *
 *  const { mutate, isLoading } = useMutationHandler('/api/users/:id', {
 *      method: 'put',
 *      invalidate: true // Optional
 *      authenticate: true // Optional
 *      contentType: 'application/json' | 'form-data' // Optional
 *      queryKey: ['users', 'users:1'] // Optional
 *      onSuccess: () => {
 *         console.log('success');
 *      }
 *      onError: () => {
 *         console.log('error');
 *      }
 *  });
 *
 *  mutate({ name: 'John Doe' });
 */
interface mutationOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  invalidate?: boolean;
  additionalInvalidateKey?: any[];
  component?: string;
  onSuccess?: (...args: any) => void;
  onError?: (...args: any) => void;
}

function useMutationHandler<T>(
  urlTemplate: string,
  options: UseMutationOptions<T, unknown, any, unknown> &
    customOptions & { queryKey?: string[] } & mutationOptions = {}
): UseMutationResult<T, unknown, any, unknown> {
  const queryClient = useQueryClient();

  const {
    id,
    queryParams,
    method = "POST",
    invalidate = true,
    authenticate = true,
    ...restOptions
  } = options;

  const url = id ? urlTemplate.replace(":id", id) : urlTemplate;
  const BASE_URL = VITE_BASE_API_URL;

  let invalidateKeys: any[] = [];
  if (invalidate) {
    invalidateKeys = [...(options.queryKey ?? [])];
  }

  return useMutation<T, unknown, any, unknown>({
    mutationFn: async (data) => {
      const queryString = queryParams ? `${toQueryString(queryParams)}` : "";
      let requestData = data;

      if (restOptions.contentType === "form-data") {
        requestData = toFormData(requestData);
      }

      const requestUrl = `${BASE_URL}${url}${queryString}`;
      console.log("requestUrl", requestUrl);
      const requestOptions = clean({
        method,
        url: requestUrl,
        data: requestData,
        headers: generateHeaders(
          !!authenticate,
          restOptions.contentType,
          method
        ),
      }) as Record<PropertyKey, unknown>;

      return client(requestOptions);
    },
    ...restOptions,
    onSuccess: (...args) => {
      const invalidateByPartialKey = (partialKey: string) => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            (query.queryKey as any[])?.some((key: any) => key === partialKey),
        });
      };

      if (invalidate) {
        if (invalidateKeys.length > 0) {
          invalidateKeys.forEach((query) => invalidateByPartialKey(query));
        } else {
          queryClient.invalidateQueries();
        }
      }
      if (restOptions.onSuccess) {
        restOptions.onSuccess(...args);
      }
    },
    onError: (error: any) => {
      if (restOptions.onError) {
        restOptions.onError(error);
      }
    },
  });
}

export default useMutationHandler;
