import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { Account } from "../models/account.model";

export const updateUsernameSchema = z.object({
  username: z.string().min(1, {
    message: "Username must be at least 1 characters.",
  }),
});

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
