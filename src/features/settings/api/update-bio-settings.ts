import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const updateBioSettingsSchema = z.object({
  bio: z.string().max(255),
});

export type UpdateBioSettingsInput = z.infer<typeof updateBioSettingsSchema>;

export const updateBioSettings = ({
  data,
}: {
  data: UpdateBioSettingsInput;
}) => {
  return api.put<{ bio: string | null }>({
    url: "/api/v1/account/settings",
    body: data,
  });
};

type UseUpdateBioSettingsOptions = {
  mutationConfig?: MutationConfig<typeof updateBioSettings>;
};

export const useUpdateBioSettings = ({
  mutationConfig,
}: UseUpdateBioSettingsOptions = {}) => {
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
    mutationFn: updateBioSettings,
  });
};
