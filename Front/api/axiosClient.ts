import axios from "axios";

import { authStore } from "@/store/auth";

import { errorHandler, successHandler } from "./responseHandler";

const client = axios.create();
// client.defaults.withCredentials = true; // allows the browser to send cookies along with cross-origin requests.

export function generateHeaders(
  authenticate: boolean,
  contentType?: string,
  method?: string
) {
  const TOKEN = authStore.getState().authToken;

  const headers: Record<string, unknown> = {};

  const ContentType = "Content-Type";
  // Only set Content-Type for non-GET requests or when explicitly provided
  // GET requests don't need Content-Type and setting it can trigger unnecessary CORS preflight
  if (contentType === "" || !contentType) {
    if (method && method.toLowerCase() !== "get") {
      headers[ContentType] = "application/x-www-form-urlencoded";
    }
    // Don't set Content-Type for GET requests
  } else if (contentType === "form-data") {
    headers[ContentType] = "multipart/form-data";
  } else if (contentType?.length) {
    headers[ContentType] = contentType;
  }

  if (authenticate && TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  return headers;
}

client.interceptors.response.use(successHandler, errorHandler);

client.interceptors.request.use((config) => {
  return config;
});
export default client;
