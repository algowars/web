import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { Account } from "../models/account.model";

export const createAccountSchema = z.object({
  username: z.string().min(1, {
    message: "Username must be at least 1 characters.",
  }),
  imageUrl: z.string().optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const createAccount = ({
  data,
  accessToken,
}: {
  data: CreateAccountInput;
  accessToken: string;
}) => {
  return api.post<Account>({ url: "/api/v1/account", body: data, accessToken });
};

type UseCreateAccountOptions = {
  mutationConfig?: MutationConfig<typeof createAccount>;
};

export const useCreateAccount = ({
  mutationConfig,
}: UseCreateAccountOptions = {}) => {
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
    mutationFn: createAccount,
  });
};
