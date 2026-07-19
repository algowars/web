import { baseApi } from "@/shared/lib/base-api";

export type RunTestCaseInputRequest = {
  inputs: string[];
};

export type CreateRunSubmissionRequest = {
  problemSetupId: string;
  code: string;
  customTestCases?: RunTestCaseInputRequest[];
};

export type CreateGradeSubmissionRequest = {
  problemSetupId: string;
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
    createRunSubmission: builder.mutation<string, CreateRunSubmissionRequest>({
      query: (body) => ({
        url: "/api/v1/submission/run",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Submission"],
    }),
    createGradeSubmission: builder.mutation<
      string,
      CreateGradeSubmissionRequest
    >({
      query: (body) => ({
        url: "/api/v1/submission/grade",
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

export const {
  useCreateRunSubmissionMutation,
  useCreateGradeSubmissionMutation,
  useGetSubmissionStatusQuery,
} = submissionApi;
