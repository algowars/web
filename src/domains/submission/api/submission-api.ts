import { baseApi } from "@/shared/lib/base-api";

export type CreateSubmissionRequest = {
  problemSetupId: string;
  type: string;
  code: string;
};

export type SubmissionResultStatus =
  | "Pending"
  | "Processing"
  | "Accepted"
  | "WrongAnswer"
  | "TimeLimitExceeded"
  | "MemoryLimitExceeded"
  | "RuntimeError"
  | "CompileError";

export type SubmissionStatus =
  | "Queued"
  | "Running"
  | "Accepted"
  | "WrongAnswer";

export type SubmissionResultStatusDto = {
  status: SubmissionResultStatus;
  runtime: number | null;
  memoryUsed: number | null;
  actualOutput: string | null;
  expectedOutput: string | null;
  standardOutput: string | null;
  standardError: string | null;
  compileOutput: string | null;
};

export type SubmissionStatusDto = {
  submissionId: string;
  problemSetupId: string;
  status: SubmissionStatus;
  results: SubmissionResultStatusDto[];
};

export const submissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubmission: builder.mutation<string, CreateSubmissionRequest>({
      query: (body) => ({
        url: "/api/v1/submission",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Submission"],
    }),
    getSubmissionStatus: builder.query<SubmissionStatusDto, string>({
      query: (submissionId) => ({
        url: `/api/v1/submission/${submissionId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, submissionId) => [
        { type: "Submission", id: submissionId },
      ],
    }),
  }),
});

export const { useCreateSubmissionMutation, useGetSubmissionStatusQuery } =
  submissionApi;
