import { baseApi } from "@/shared/lib/base-api";

export const healthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query<{ status: string; timestamp: string }, void>({
      query: () => ({
        url: "/api/v1/health",
        method: "GET",
      }),
      providesTags: ["Health"],
    }),
  }),
});

export const { useGetHealthQuery } = healthApi;
