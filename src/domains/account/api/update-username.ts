import { api } from "@/shared/lib/api-client";
import { accountSetupSchema } from "../schemas/account-setup-schema";
import { Account } from "../models/account";
import z from "zod";
import { MutationConfig } from "@/shared/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateUsernameInput = z.infer<typeof accountSetupSchema>;

export const updateUsername = ({ data }: { data: UpdateUsernameInput }) => {
  return api.put<Account>("/api/v1/account/username", data);
};

type UseUpdateUsernameOptions = {
  mutationConfig?: MutationConfig<typeof updateUsername>;
};

export const useUpdateUsername = ({
  mutationConfig,
}: UseUpdateUsernameOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["account"],
      });
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUsername,
  });
};
