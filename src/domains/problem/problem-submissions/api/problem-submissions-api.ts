import { baseApi } from "@/shared/lib/base-api";
import { ProblemSubmission } from "../models/problem-submission";
import { PageResult } from "@/shared/pagination/page-result";
import { SubmissionFilterType } from "../models/submission-filter-type";
import { SubmissionOrderByType } from "../models/submission-order-by-type";

export const problemSubmissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProblemSubmissions: builder.query<
      PageResult<ProblemSubmission>,
      {
        slug: string;
        page: number;
        size: number;
        timestamp: string;
        type?: SubmissionFilterType;
        sortBy?: SubmissionOrderByType;
      }
    >({
      query: ({ slug, page, size, timestamp, type, sortBy }) => ({
        url: `/api/v1/problem/${encodeURIComponent(slug)}/submissions`,
        params: {
          page,
          size,
          timestamp,
          type,
          sortBy,
        },
      }),
      providesTags: ["Submission"],
    }),
  }),
});

export const { useGetProblemSubmissionsQuery } = problemSubmissionsApi;
