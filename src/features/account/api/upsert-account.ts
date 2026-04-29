import { Account } from "@/features/auth/models/account.model";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const upsertAccountSchema = z.object({
  imageUrl: z.string().optional(),
});

export type UpsertAccountInput = z.infer<typeof upsertAccountSchema>;

export const upsertAccount = ({ data }: { data: UpsertAccountInput }) => {
  return api.put<Account>({ url: "/api/v1/account", body: data });
};

type UserUpsertAccountOptions = {
  mutationConfig?: MutationConfig<typeof upsertAccount>;
};

export const useUpsertAccount = ({
  mutationConfig,
}: UserUpsertAccountOptions = {}) => {
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
    mutationFn: upsertAccount,
  });
};
