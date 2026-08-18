import { toAxiosConfig } from "@/shared/lib/request-config";
import { defineAuthenticatedQuery } from "@/shared/api/define-authenticated-query";
import type { RequestConfig } from "@/shared/lib/request-config";
import type { User } from "../models/user";
import { apiClient } from "@/shared/lib/api-client";

export const getAccount = ({ abortController }: RequestConfig) =>
  apiClient
    .get<User>("/api/v1/user", toAxiosConfig({ abortController }))
    .then((res) => res.data);

const accountQuery = defineAuthenticatedQuery({
  queryKey: () => ["account"],
  queryFn: getAccount,
});

export const useAccount = accountQuery.useQuery;
