import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/env";

type TokenResponse = { accessToken: string | null; expiresIn?: number };

let cachedToken: { token: string; expiresAt: number } | null = null;
let inFlight: Promise<string | null> | null = null;

async function fetchAccessToken(): Promise<string | null> {
  const res = await fetch("/api/auth/token");
  const { accessToken, expiresIn }: TokenResponse = res.ok
    ? await res.json()
    : { accessToken: null };

  if (!accessToken) {
    cachedToken = null;
    return null;
  }

  cachedToken = {
    token: accessToken,
    expiresAt: Date.now() + (expiresIn ?? 60) * 1000,
  };
  return accessToken;
}

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5_000) {
    return cachedToken.token;
  }

  if (!inFlight) {
    inFlight = fetchAccessToken().finally(() => {
      inFlight = null;
    });
  }

  return inFlight;
}

function resolveRequestUrl(config: InternalAxiosRequestConfig): string {
  const url = config.url ?? "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${config.baseURL ?? ""}${url}`;
}

function isApiServerRequest(config: InternalAxiosRequestConfig): boolean {
  return resolveRequestUrl(config).startsWith(env.NEXT_PUBLIC_API_SERVER_URL);
}

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_SERVER_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config) => {
  if (!isApiServerRequest(config)) return config;

  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    if (axios.isCancel(error)) return Promise.reject(error);

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
      cachedToken = null;
      const accessToken = await getAccessToken();
      if (accessToken) {
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      }
      return Promise.reject(
        new Error("Session expired. Please sign in again.")
      );
    }

    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  }
);
