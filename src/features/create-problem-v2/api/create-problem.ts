import { api } from "@/lib/api-client";
import { CreateProblemModel } from "../models/create-problem-model";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const createProblem = ({
  data,
  accessToken,
}: {
  data: CreateProblemModel;
  accessToken: string;
}) => {
  return api.post<string>({ url: "/api/v1/problem", body: data, accessToken });
};

type UseCreateProblemOptions = {
  mutationConfig?: MutationConfig<typeof createProblem>;
};

export const useCreateProblem = ({
  mutationConfig,
}: UseCreateProblemOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["create-account"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createProblem,
  });
};
