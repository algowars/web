import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const updateUsernameSettingsSchema = z.object({
  username: z.string().min(1, {
    message: "Username cannot be empty.",
  }),
});

export type UpdateUsernameSettingsInput = z.infer<
  typeof updateUsernameSettingsSchema
>;

export const updateUsernameSettings = ({
  data,
}: {
  data: UpdateUsernameSettingsInput;
}) => {
  return api.put<{ username: string; usernameLastChangedAt: string | null }>({
    url: "/api/v1/account/username",
    body: data,
  });
};

type UseUpdateUsernameSettingsOptions = {
  mutationConfig?: MutationConfig<typeof updateUsernameSettings>;
};

export const useUpdateUsernameSettings = ({
  mutationConfig,
}: UseUpdateUsernameSettingsOptions = {}) => {
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
    mutationFn: updateUsernameSettings,
  });
};
