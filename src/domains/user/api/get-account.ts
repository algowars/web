import { toAxiosConfig } from "@/shared/lib/request-config";
import { defineAuthenticatedQuery } from "@/shared/api/define-authenticated-query";
import type { RequestConfig } from "@/shared/lib/request-config";
import type { User } from "../models/user";
import { http } from "@/shared/lib/http";

export const getAccount = ({ abortController }: RequestConfig) =>
  http.get<User>("/api/v1/user", toAxiosConfig({ abortController }));

const accountQuery = defineAuthenticatedQuery({
  queryKey: () => ["account"],
  queryFn: getAccount,
});

export const useAccount = accountQuery.useQuery;
