import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const createSubmissionSchema = z.object({
  code: z.string(),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

export const createSubmission = ({
  data,
  accessToken,
}: {
  data: CreateSubmissionInput;
  accessToken: string;
}) => {
  return api.post<string>({
    url: "/api/v1/submission",
    body: data,
    accessToken,
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
