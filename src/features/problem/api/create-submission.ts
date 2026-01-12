import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmissionStatus } from "../models/submission-status";
import { RunResult } from "../models/run-result";

export const createSubmission = async ({
  code,
  problemSetupId,
  accessToken,
}: {
  code: string;
  problemSetupId: number;
  accessToken: string;
}): Promise<RunResult> => {
  const submissionId = await api.post<string>({
    url: "/api/v1/submission/execute",
    body: {
      code,
      problemSetupId,
    },
    accessToken,
  });

  return {
    submissionId,
    status: SubmissionStatus.Pending,
    testCases: [],
  };
};

type UseCreateSubmissionOptions = {
  mutationConfig?: MutationConfig<typeof createSubmission>;
};

export const useCreateSubmission = ({
  mutationConfig,
}: UseCreateSubmissionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["create-submission"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createSubmission,
  });
};
