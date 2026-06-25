import { api } from "@/shared/lib/api-client";
import { userSetupSchema } from "../schemas/user-setup-schema";
import { User } from "../models/user";
import z from "zod";
import { MutationConfig } from "@/shared/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateUsernameInput = z.infer<typeof userSetupSchema>;

export const updateUsername = ({ data }: { data: UpdateUsernameInput }) => {
  return api.put<User>({
    url: "/api/v1/user/username",
    body: data,
  });
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
        queryKey: ["user"],
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
