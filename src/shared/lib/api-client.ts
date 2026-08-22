import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { env } from "@/env";

function resolveRequestUrl(config: InternalAxiosRequestConfig): string {
  const url = config.url ?? "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${config.baseURL ?? ""}${url}`;
}

function isApiServerRequest(config: InternalAxiosRequestConfig): boolean {
  return resolveRequestUrl(config).startsWith(env.NEXT_PUBLIC_API_SERVER_URL);
}

/** `getAccessToken()` throws when there's no active session — expected for a
 *  signed-out visitor hitting a public endpoint, not a real failure. */
async function getAccessTokenSafely(): Promise<string | undefined> {
  try {
    return await getAccessToken();
  } catch {
    return undefined;
  }
}

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_SERVER_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config) => {
  if (!isApiServerRequest(config)) return config;

  const accessToken = await getAccessTokenSafely();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    if (axios.isCancel(error)) throw error;

    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      isApiServerRequest(original) &&
      !original._retry
    ) {
      original._retry = true;
      const accessToken = await getAccessTokenSafely();
      if (accessToken) {
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      }

      throw new Error("Session expired. Please sign in again.");
    }

    const message = error.response?.data?.message ?? error.message;
    throw new Error(message);
  }
);
