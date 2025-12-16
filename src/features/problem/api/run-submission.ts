import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const runSubmission = ({
  code,
  problemSetupId,
  accessToken,
}: {
  code: string;
  problemSetupId: number;
  accessToken: string;
}) => {
  return api.post({
    url: "/api/v1/submission/run",
    body: {
      code,
      problemSetupId: 19,
    },
    accessToken,
  });
};

type UseRunSubmissionOptions = {
  mutationConfig?: MutationConfig<typeof runSubmission>;
};

export const useRunSubmission = ({
  mutationConfig,
}: UseRunSubmissionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: (variables: {
      code: string;
      problemSetupId: number;
      accessToken: string;
    }) => runSubmission(variables),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["create-submission"],
      });
      onSuccess?.(...args);
    },
  });
};
