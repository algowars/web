import { api } from "@/lib/api-client";
import { AccountSettingsAggregateModel } from "../models/account-settings-aggregate.model";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getAccountSettings = ({
  accessToken,
}: {
  accessToken: string;
}) => {
  if (!accessToken) {
    return null;
  }

  return api.get<AccountSettingsAggregateModel | null>({
    url: "/api/v1/account/find/settings",
    accessToken,
  });
};

export const getAccountSettingsQueryOptions = (accessToken: string) => {
  return queryOptions({
    queryKey: ["account", accessToken],
    queryFn: () => getAccountSettings({ accessToken }),
  });
};

type UseAccountSettingsOptions = {
  accessToken: string;
  queryConfig?: QueryConfig<typeof getAccountSettingsQueryOptions>;
};

export const useAccountSettings = ({
  accessToken,
  queryConfig = {},
}: UseAccountSettingsOptions) => {
  return useQuery({
    ...getAccountSettingsQueryOptions(accessToken),
    ...queryConfig,
  });
};
