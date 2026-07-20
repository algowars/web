import { baseApi } from "@/shared/lib/base-api";
import { ProblemSubmission } from "../models/problem-submission";
import { PageResult } from "@/shared/pagination/page-result";

export const problemSubmissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProblemSubmissions: builder.query<
      PageResult<ProblemSubmission>,
      { problemId: string; page: number; size: number; timestamp: string }
    >({
      query: ({ problemId, page, size, timestamp }) => ({
        url: `/api/v1/problems/submissions`,
        params: {
          problemId,
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
