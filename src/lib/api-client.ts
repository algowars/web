import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import { env } from "@/env";

type ApiRequestConfig = {
  url: string;
  config?: AxiosRequestConfig;
  accessToken?: string;
};

type ApiRequestWithBodyConfig = {
  url: string;
  body?: any;
  config?: AxiosRequestConfig;
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
  get<T>(request: ApiRequestConfig): Promise<T> {
    const { url, config = {}, accessToken } = request;
    const finalConfig = addAuthToken(config, accessToken);

    return apiClient.get<T>(url, finalConfig).then((response) => response.data);
  },

  post<T>(request: ApiRequestWithBodyConfig): Promise<T> {
    const { url, body, config = {}, accessToken } = request;
    const finalConfig = addAuthToken(config, accessToken);

    return apiClient
      .post<T>(url, body, finalConfig)
      .then((response) => response.data);
  },

  put<T>(request: ApiRequestWithBodyConfig): Promise<T> {
    const { url, body, config = {}, accessToken } = request;
    const finalConfig = addAuthToken(config, accessToken);

    return apiClient
      .put<T>(url, body, finalConfig)
      .then((response) => response.data);
  },

  patch<T>(request: ApiRequestWithBodyConfig): Promise<T> {
    const { url, body, config = {}, accessToken } = request;
    const finalConfig = addAuthToken(config, accessToken);

    return apiClient
      .patch<T>(url, body, finalConfig)
      .then((response) => response.data);
  },

  delete<T>(request: ApiRequestConfig): Promise<T> {
    const { url, config = {}, accessToken } = request;
    const finalConfig = addAuthToken(config, accessToken);

    return apiClient
      .delete<T>(url, finalConfig)
      .then((response) => response.data);
  },
};

export { apiClient };
