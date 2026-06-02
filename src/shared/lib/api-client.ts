"use client";

import axios from "axios";
import { env } from "@/env";
import { auth0 } from "@/shared/lib/auth0";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_SERVER_URL,
  timeout: 10_000,
});

const apiServerBaseUrl = env.NEXT_PUBLIC_API_SERVER_URL.replace(/\/+$/, "");

function isApiServerRequest(config: { url?: string; baseURL?: string }) {
  if (!config.url) {
    return false;
  }

  try {
    const resolvedUrl = new URL(
      config.url,
      config.baseURL ?? api.defaults.baseURL
    ).toString();

    return resolvedUrl.startsWith(apiServerBaseUrl);
  } catch {
    return false;
  }
}

api.interceptors.request.use(async function (config) {
  if (!isApiServerRequest(config)) {
    return config;
  }

  try {
    const { token } = await auth0.getAccessToken();

    if (token && !config.headers?.Authorization) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}

  return config;
});
