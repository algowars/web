import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import { env } from "@/env";

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  accessToken?: string;
};

export function getServerCookies() {
  if (typeof window !== "undefined") return "";

  return import("next/headers").then(async ({ cookies }) => {
    try {
      const cookieStore = cookies();
      return (await cookieStore)
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    } catch (error) {
      console.error("Failed to access cookies:", error);
      return "";
    }
  });
}

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.NEXT_PUBLIC_API_SERVER_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  client.interceptors.request.use(
    async (config) => {
      if (config.params) {
        config.params = Object.fromEntries(
          Object.entries(config.params).filter(
            ([, value]) => value !== undefined && value !== null
          )
        );
      }

      if (typeof window === "undefined") {
        try {
          const cookieHeader = await getServerCookies();
          if (cookieHeader) {
            config.headers.Cookie = cookieHeader;
          }
        } catch (error) {
          console.error("Failed to get server cookies:", error);
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      const message =
        error.response?.data?.message || error.message || "An error occurred";

      if (typeof window !== "undefined") {
        toast.error("Error", {
          description: message,
        });
      }

      return Promise.reject(new Error(message));
    }
  );

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

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    const config = addAuthToken(
      {
        params: options?.params,
        headers: options?.headers,
      },
      options?.accessToken
    );

    return apiClient.get<T>(url, config).then((response) => response.data);
  },

  post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    const config = addAuthToken(
      {
        params: options?.params,
        headers: options?.headers,
      },
      options?.accessToken
    );

    return apiClient
      .post<T>(url, body, config)
      .then((response) => response.data);
  },

  put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    const config = addAuthToken(
      {
        params: options?.params,
        headers: options?.headers,
      },
      options?.accessToken
    );

    return apiClient
      .put<T>(url, body, config)
      .then((response) => response.data);
  },

  patch<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    const config = addAuthToken(
      {
        params: options?.params,
        headers: options?.headers,
      },
      options?.accessToken
    );

    return apiClient
      .patch<T>(url, body, config)
      .then((response) => response.data);
  },

  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    const config = addAuthToken(
      {
        params: options?.params,
        headers: options?.headers,
      },
      options?.accessToken
    );

    return apiClient.delete<T>(url, config).then((response) => response.data);
  },
};

export { apiClient };
