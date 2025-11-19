import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type ProfileSettingsResponse = {
  username: string;
};

export const getProfileSettings = () => {
  return api.get<ProfileSettingsResponse>({
    url: "/api/account/settings/profile",
  });
};

export const getProfileSettingsQueryOptions = () => {
  return queryOptions({
    queryKey: ["profile-settings"],
    queryFn: () => getProfileSettings(),
  });
};

type UseProfileSettingsOptions = {
  queryConfig?: QueryConfig<typeof getProfileSettingsQueryOptions>;
};

export const useProfileSettings = ({
  queryConfig = {},
}: UseProfileSettingsOptions = {}) => {
  return useQuery({
    ...getProfileSettingsQueryOptions(),
    ...queryConfig,
  });
};
