import { baseApi } from "@/shared/lib/base-api";
import type { User } from "../models/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccount: builder.query<User, void>({
      query: () => ({
        url: "/api/v1/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getProfile: builder.query<User, void>({
      query: () => ({
        url: "/api/v1/user/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    upsertUser: builder.mutation<User, { sub: string }>({
      query: (body) => ({
        url: "/api/v1/user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUsername: builder.mutation<User, { username: string }>({
      query: (body) => ({
        url: "/api/v1/user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAccountQuery,
  useGetProfileQuery,
  useUpsertUserMutation,
  useUpdateUsernameMutation,
} = userApi;
