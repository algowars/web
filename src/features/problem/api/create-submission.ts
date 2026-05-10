import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const createSubmission = async ({
  code,
  problemSetupId,
}: {
  code: string;
  problemSetupId: number;
}): Promise<string> => {
  return api.post<string>({
    url: "/api/v1/submission/execute",
    body: {
      code,
      problemSetupId,
    },
  });
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
