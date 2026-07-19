import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { env } from "@/env";

const baseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_SERVER_URL,

  prepareHeaders: async (headers) => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    } catch {}

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Order", "User", "Product", "Problem", "Submission"],
  endpoints: () => ({}),
});
