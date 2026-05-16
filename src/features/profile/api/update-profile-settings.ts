import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const updateProfileSettingsSchema = z.object({
  bio: z.string().max(255),
});

export type UpdateProfileSettingsInput = z.infer<
  typeof updateProfileSettingsSchema
>;

export const updateProfileSettings = ({
  data,
}: {
  data: UpdateProfileSettingsInput;
}) => {
  return api.put<{ bio: string | null }>({
    url: "/api/v1/account/settings",
    body: data,
  });
};

type UseUpdateProfileSettingsOptions = {
  mutationConfig?: MutationConfig<typeof updateProfileSettings>;
};

export const useUpdateProfileSettings = ({
  mutationConfig,
}: UseUpdateProfileSettingsOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateProfileSettings,
  });
};
