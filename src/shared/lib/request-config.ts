import type { AxiosRequestConfig } from "axios";

export type RequestConfig = {
  accessToken?: string;
  abortController?: AbortController;
};

export function toAxiosConfig({
  accessToken,
  abortController,
}: RequestConfig = {}): AxiosRequestConfig {
  return {
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    signal: abortController?.signal,
  };
}
