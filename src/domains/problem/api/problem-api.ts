import { baseApi } from "@/shared/lib/base-api";
import type { Problem } from "../models/problem";
import type { ProblemSetup } from "../models/problem-setup";

export const problemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProblemBySlug: builder.query<Problem, { slug: string }>({
      query: ({ slug }) => ({
        url: `/api/v1/problem/${slug}`,
        method: "GET",
      }),
      providesTags: ["Problem"],
    }),
    getProblemSetup: builder.query<
      ProblemSetup,
      { slug: string; languageVersionId: string }
    >({
      query: ({ slug, languageVersionId }) => ({
        url: `/api/v1/problem/${slug}/setup`,
        method: "GET",
        params: { languageVersionId },
      }),
      providesTags: ["Problem"],
    }),
    getProblemById: builder.query<Problem, string>({
      query: (id) => ({
        url: `/api/v1/problem/by-id/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Problem", id }],
    }),
  }),
});

export const { useGetProblemBySlugQuery, useGetProblemByIdQuery } =
  problemApi;
