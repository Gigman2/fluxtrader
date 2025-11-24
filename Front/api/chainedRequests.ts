import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clean, toFormData, toQueryString } from "@/utilities/misc.util";
import getEnv from "@/utilities/envs.util";

const { VITE_BASE_API_URL } = getEnv();

import client, { generateHeaders } from "./axiosClient";

export interface MutationConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  queryKeys?: string[];
  contentType?: "application/json" | "form-data" | "multipart/form-data";
  authenticate?: boolean;
  queryParams?: Record<string, unknown>;
}

interface ChainedMutationOptions {
  onSuccess?: (...args: any[]) => void;
  onError?: (...args: any[]) => void;
}

function useChainedMutations(
  urlOptions: MutationConfig[],
  options: ChainedMutationOptions = {}
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payloads: any[]) => {
      for (let i = 0; i < urlOptions.length; i++) {
        if (payloads[i] === null) {
          continue;
        }
        const config = urlOptions[i];
        const payload = payloads[i];
        const BASE_URL = VITE_BASE_API_URL;

        const {
          url,
          method = "POST",
          queryParams,
          contentType,
          authenticate = true,
        } = config;

        const queryString = queryParams ? `${toQueryString(queryParams)}` : "";
        let requestData = payload;

        if (contentType === "form-data") {
          requestData = toFormData(requestData);
        }

        const requestOptions = clean({
          method,
          url: `${BASE_URL}${url}${queryString}`,
          data: requestData,
          headers: generateHeaders(authenticate, contentType, method),
        }) as Record<PropertyKey, unknown>;

        await client(requestOptions);
      }
    },
    onSuccess: (...args) => {
      urlOptions.forEach((config) => {
        if (config.queryKeys) {
          config.queryKeys.forEach((key) => {
            // Ensure key is an array for queryKey
            const queryKey = Array.isArray(key) ? key : [key];
            queryClient.invalidateQueries({ queryKey });
          });
        }
      });
      options.onSuccess?.(...args);
    },
    onError: (...args) => {
      options.onError?.(...args);
    },
  });

  return mutation;
}

export default useChainedMutations;

// const { mutate, isLoading } = useChainedMutations([
//     { url: '/api/users/1', method: 'PATCH', queryKeys: ['users'] },
//     { url: '/api/orders/1', method: 'PATCH', queryKeys: ['orders'] }
//   ]);

//   // To trigger the mutations with separate payloads
//   mutate([
//     { name: 'John' }, // Payload for the first request
//     { status: 'completed' } // Payload for the second request
//   ]);
