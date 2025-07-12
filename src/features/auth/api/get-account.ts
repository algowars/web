import { api } from "@/lib/api-client";
import { Account } from "../models/account.model";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryConfig, QueryConfig } from "@/lib/react-query";

export const getAccount = ({ accessToken }: { accessToken: string }) => {
  return api.get<Account | null>("/api/v1/account/find/profile", {
    accessToken,
  });
};

export const getAccountQueryOptions = (accessToken: string) => {
  return queryOptions({
    queryKey: ["account"],
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
