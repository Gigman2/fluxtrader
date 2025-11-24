import { isAxiosError } from "axios";

import getEnv from "@/utilities/envs.util";
import { clean, toQueryString } from "@/utilities/misc.util";

const { VITE_BASE_API_URL } = getEnv();

import client, { generateHeaders } from "./axiosClient";

interface fetchDataOptions {
  authenticate?: boolean;
  contentType?: string;
}
async function fetchData<T>({
  queryKey,
  authenticate = true,
  ...queryOptions
}: { queryKey: any } & fetchDataOptions) {
  const [url, queryParams] = queryKey;
  const queryString = queryParams ? `${toQueryString(queryParams)}` : "";
  const BASE_URL = VITE_BASE_API_URL;

  const options = clean({
    method: "GET",
    url: `${BASE_URL}${url}${queryString}`,
    headers: generateHeaders(!!authenticate, queryOptions.contentType, "GET"),
  }) as Record<PropertyKey, unknown>;

  try {
    const response = await client(options);
    return response.data as T;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
}

export default fetchData;
