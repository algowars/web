import { api } from "@/lib/api-client";
import { Account } from "../models/account.model";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryConfig, QueryConfig } from "@/lib/react-query";

export const getAccount = ({ accessToken }: { accessToken: string }) => {
  if (!accessToken) {
    return null;
  }

  return api.get<Account | null>({
    url: "/api/v1/account/find/profile",
    accessToken,
  });
};

export const getAccountQueryOptions = (accessToken: string) => {
  return queryOptions({
    queryKey: ["account", accessToken],
    queryFn: () => getAccount({ accessToken }),
  });
};

type UseAccountOptions = {
  accessToken: string;
  queryConfig?: QueryConfig<typeof getAccountQueryOptions>;
};

export const useAccount = ({ accessToken }: UseAccountOptions) => {
  return useQuery({
    ...getAccountQueryOptions(accessToken),
    ...queryConfig,
  });
};
