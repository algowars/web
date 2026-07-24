import { baseApi } from "@/shared/lib/base-api";
import { ProblemSubmission } from "../models/problem-submission";
import { PageResult } from "@/shared/pagination/page-result";

export const problemSubmissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProblemSubmissions: builder.query<
      PageResult<ProblemSubmission>,
      { slug: string; page: number; size: number; timestamp: string }
    >({
      query: ({ slug, page, size, timestamp }) => ({
        url: `/api/v1/problem/${encodeURIComponent(slug)}/submissions`,
        params: {
          page,
          size,
          timestamp,
        },
      }),
      providesTags: ["Submission"],
    }),
  }),
});

export const { useGetProblemSubmissionsQuery } = problemSubmissionsApi;
