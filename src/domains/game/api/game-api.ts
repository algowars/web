import { baseApi } from "@/shared/lib/base-api";

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableGames: builder.query({
      query: () => ({
        url: "/api/v1/game",
      }),
      providesTags: ["GameAvailable"],
    }),
  }),
});
