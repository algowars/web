import { useQuery } from "@tanstack/react-query";
import { http } from "@/shared/lib/http";
import { toAxiosConfig } from "@/shared/lib/request-config";
import type { SubmissionStatusDto } from "../models/submission-status";

export const getSubmissionStatus = ({
  submissionId,
  signal,
}: {
  submissionId: string;
  signal?: AbortSignal;
}) =>
  http.get<SubmissionStatusDto>(
    `/api/v1/submission/${submissionId}`,
    toAxiosConfig({ signal })
  );

export const submissionStatusQueryKey = (submissionId: string) => [
  "submission-status",
  submissionId,
];

const terminalSubmissionStatuses = new Set<string>([
  "Accepted",
  "WrongAnswer",
  "TimeLimitExceeded",
  "MemoryLimitExceeded",
  "RuntimeError",
  "CompileError",
]);

const isPendingSubmissionStatus = (status: string) =>
  !terminalSubmissionStatuses.has(status);

/**
 * Polls the submission's status while it's non-terminal, mirroring the RTK Query
 * `pollingInterval` behaviour it replaces. Polling stops automatically once the
 * status reaches a terminal state.
 */
export function useSubmissionStatus(submissionId: string | null) {
  return useQuery({
    queryKey: submissionStatusQueryKey(submissionId ?? ""),
    queryFn: ({ signal }) =>
      getSubmissionStatus({ submissionId: submissionId as string, signal }),
    enabled: !!submissionId,
    refetchOnMount: "always",
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || isPendingSubmissionStatus(data.status)) {
        return 10_000;
      }
      return false;
    },
    meta: { errorToast: "Failed to load submission status" },
  });
}
