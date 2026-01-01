/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { env } from "@/env";

type ApiRequestConfig = {
  url: string;
  config?: AxiosRequestConfig;
  accessToken?: string;
};

type ApiRequestWithBodyConfig<T = unknown> = {
  url: string;
  body?: T;
  config?: AxiosRequestConfig;
  accessToken?: string;
};

export interface ApiError {
  field?: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  errors?: ApiError[];
  message?: string;
}

export class ApiException extends Error {
  errors: ApiError[];
  constructor(message: string, errors: ApiError[] = []) {
    super(message);
    this.errors = errors;
  }
}

export async function getServerCookies() {
  if (typeof window !== "undefined") return "";

  const { cookies } = await import("next/headers");
  try {
    const cookieStore = cookies();
    return (await cookieStore)
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  } catch {
    return "";
  }
}

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.NEXT_PUBLIC_API_SERVER_URL,
    timeout: 10_000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  client.interceptors.request.use(async (config) => {
    if (config.params) {
      config.params = Object.fromEntries(
        Object.entries(config.params).filter(
          ([, value]) => value !== undefined && value !== null
        )
      );
    }

    if (typeof window === "undefined") {
      const cookieHeader = await getServerCookies();
      if (cookieHeader) config.headers.Cookie = cookieHeader;
    }

    return config;
  });

  return client;
};

const apiClient = createApiClient();

const addAuthToken = (
  config: AxiosRequestConfig,
  accessToken?: string
): AxiosRequestConfig => {
  if (accessToken) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }
  return config;
};

const handleRequest = async <T>(request: Promise<any>): Promise<T> => {
  try {
    const res = await request;
    const payload = res.data as ApiResponse<T>;

    if (payload.errors && payload.errors.length > 0) {
      throw new ApiException(
        payload.message ?? "API returned errors",
        payload.errors
      );
    }

    if (payload.data !== undefined) {
      return payload.data;
    }

    return payload as unknown as T;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const resp = err.response?.data as ApiResponse<unknown>;
      const errors: ApiError[] = resp?.errors?.map((e: any) => ({
        field: e.field,
        message: e.message ?? e,
      })) ?? [{ message: resp?.message ?? "Unknown error" }];

      throw new ApiException(resp?.message ?? "API error", errors);
    }

    throw new ApiException(
      err instanceof Error ? err.message : "An unexpected error occurred",
      [{ message: err instanceof Error ? err.message : "Unknown error" }]
    );
  }
};
export const api = {
  get: <T>(request: ApiRequestConfig): Promise<T> => {
    const { url, config = {}, accessToken } = request;
    return handleRequest<T>(
      apiClient.get(url, addAuthToken(config, accessToken))
    );
  },

  post: <T, TBody = unknown>(
    request: ApiRequestWithBodyConfig<TBody>
  ): Promise<T> => {
    const { url, body, config = {}, accessToken } = request;
    return handleRequest<T>(
      apiClient.post(url, body, addAuthToken(config, accessToken))
    );
  },

  put: <T, TBody = unknown>(
    request: ApiRequestWithBodyConfig<TBody>
  ): Promise<T> => {
    const { url, body, config = {}, accessToken } = request;
    return handleRequest<T>(
      apiClient.put(url, body, addAuthToken(config, accessToken))
    );
  },

  patch: <T, TBody = unknown>(
    request: ApiRequestWithBodyConfig<TBody>
  ): Promise<T> => {
    const { url, body, config = {}, accessToken } = request;
    return handleRequest<T>(
      apiClient.patch(url, body, addAuthToken(config, accessToken))
    );
  },

  delete: <T>(request: ApiRequestConfig): Promise<T> => {
    const { url, config = {}, accessToken } = request;
    return handleRequest<T>(
      apiClient.delete(url, addAuthToken(config, accessToken))
    );
  },
};

export { apiClient };
