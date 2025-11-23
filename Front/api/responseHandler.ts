import { AxiosResponse } from "axios";

import { authStore } from "../store/auth";

export const successHandler = (
  response: AxiosResponse<any, any>
): AxiosResponse<any, any> => {
  if (response?.data?.success) {
    return response.data;
  }
  return response;
};

export const errorHandler = (error: any) => {
  const setSession = authStore.getState().setSession;
  const response = error.response || error || {};
  error.contextMessage = response.message || response?.data?.message;

  if ((response as Record<string, unknown>).code === "ERR_NETWORK") {
    error.contextMessage =
      "We are having issues connecting to the server. Please check your connection and try again";
  }

  if (error.response?.status === 500) {
    error.contextMessage =
      "Something went wrong and its from us. Our team have been notified and will get back to you shortly.";
  }

  if (error.response?.status === 403) {
    error.contextMessage = "You are not authorized to perform this action";
  }

  if (error.response?.status === 401) {
    setSession("", undefined);
    // window.location.replace("/login");
  }

  return Promise.reject(error);
};
