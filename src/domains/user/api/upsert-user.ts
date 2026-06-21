import z from "zod";
import { upsertUserSchema } from "../schemas/upsert-user-schema";
import { api } from "@/shared/lib/api-client";
import { User } from "../models/user";
import { MutationConfig } from "@/shared/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpsertUserInput = z.infer<typeof upsertUserSchema>;

export const upsertUser = ({ data }: { data: UpsertUserInput }) => {
  return api.put<User>("/api/v1/user", data);
};

type UpsertUserOptions = {
  mutationConfig?: MutationConfig<typeof upsertUser>;
};

export const useUpsertUser = ({ mutationConfig }: UpsertUserOptions) => {
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
    mutationFn: upsertUser,
  });
};
