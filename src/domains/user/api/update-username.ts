import { toAxiosConfig } from "@/shared/lib/request-config";
import { defineAuthenticatedMutation } from "@/shared/api/define-authenticated-mutation";
import type { RequestConfig } from "@/shared/lib/request-config";
import type { User } from "../models/user";
import { http } from "@/shared/lib/http";

type UpsertUserVariables = { username: string };

export const updateUsername = ({
  abortController,
  ...data
}: UpsertUserVariables & RequestConfig) =>
  http.put<User>("/api/v1/user", data, toAxiosConfig({ abortController }));

const updateUsernameMutation = defineAuthenticatedMutation<
  User,
  UpsertUserVariables
>({
  mutationFn: updateUsername,
  invalidateQueries: () => [["account"]],
});

export const useUpdateUsername = updateUsernameMutation.useMutation;
