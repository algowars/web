import z from "zod";
import { upsertAccountSchema } from "../schemas/upsert-account-schema";
import { api } from "@/shared/lib/api-client";
import { Account } from "../models/account";
import { MutationConfig } from "@/shared/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpsertAccountInput = z.infer<typeof upsertAccountSchema>;

export const upsertAccount = ({ data }: { data: UpsertAccountInput }) => {
  return api.put<Account>("/api/v1/account", data);
};

type UpsertAccountOptions = {
  mutationConfig?: MutationConfig<typeof upsertAccount>;
};

export const useUpsertAccount = ({ mutationConfig }: UpsertAccountOptions) => {
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
    mutationFn: upsertAccount,
  });
};
