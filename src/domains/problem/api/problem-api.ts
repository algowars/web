import { baseApi } from "@/shared/lib/base-api";
import type { PageResult } from "@/shared/pagination/page-result";
import type { Problem } from "../models/problem";
import type { ProblemSetup } from "../models/problem-setup";
import type { ProblemSummary } from "../models/problem-summary";

export const problemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProblems: builder.query<
      PageResult<ProblemSummary>,
      { page: number; size: number; timestamp: string }
    >({
      query: ({ page, size, timestamp }) => ({
        url: "/api/v1/problem",
        method: "GET",
        params: { page, size, timestamp },
      }),
      providesTags: ["Problem"],
    }),
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

export const {
  useGetProblemsQuery,
  useGetProblemBySlugQuery,
  useGetProblemByIdQuery,
} = problemApi;
