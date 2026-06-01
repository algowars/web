import z from "zod";
import { updateUsernameSchema } from "../schemas/update-username-schema";
import { api } from "@/shared/lib/api-client";
import { Account } from "@/features/auth/models/account.model";
import { MutationConfig } from "@/shared/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;

export const updateUsername = ({ data }: { data: UpdateUsernameInput }) => {
  return api.put<Account>({ url: "/api/v1/account/username", body: data });
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
