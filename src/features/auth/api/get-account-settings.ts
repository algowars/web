import { api } from "@/lib/api-client";
import { AccountSettingsAggregateModel } from "../models/account-settings-aggregate.model";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getAccountSettings = () => {
  return api.get<AccountSettingsAggregateModel | null>({
    url: "/api/v1/account/find/settings",
  });
};

export const getAccountSettingsQueryOptions = () => {
  return queryOptions({
    queryKey: ["account-settings"],
    queryFn: () => getAccountSettings(),
  });
};

type UseAccountSettingsOptions = {
  queryConfig?: QueryConfig<typeof getAccountSettingsQueryOptions>;
};

export const useAccountSettings = ({
  queryConfig = {},
}: UseAccountSettingsOptions = {}) => {
  return useQuery({
    ...getAccountSettingsQueryOptions(),
    ...queryConfig,
  });
};
