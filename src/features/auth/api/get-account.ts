import { api } from "@/lib/api-client";
import { Account } from "../models/account.model";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getAccount = () => {
  console.log("QUERYING");
  return api.get<Account | null>({
    url: "/api/v1/account/find/profile",
  });
};

export const getAccountQueryOptions = () => {
  return queryOptions({
    queryKey: ["account"],
    queryFn: () => getAccount(),
  });
};

type UseAccountOptions = {
  enabled?: boolean;
  queryConfig?: QueryConfig<typeof getAccountQueryOptions>;
};

export const useAccount = ({
  enabled = true,
  queryConfig = {},
}: UseAccountOptions = {}) => {
  return useQuery({
    ...getAccountQueryOptions(),
    enabled,
    ...queryConfig,
  });
};
