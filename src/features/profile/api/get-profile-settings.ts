import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { ProfileSettingsDto } from "../models/profile-settings.dto";

export const getProfileSettings = ({
  accessToken,
}: {
  accessToken: string;
}) => {
  if (!accessToken) {
    return null;
  }

  return api.get<ProfileSettingsDto | null>({
    url: "/api/v1/account/find/settings/profile",
    accessToken,
  });
};

export const getProfileSettingsQueryOptions = (accessToken: string) => {
  return queryOptions({
    queryKey: ["settings", "profile", accessToken],
    queryFn: () => getProfileSettings({ accessToken }),
  });
};

type UseProfileSettingsOptions = {
  accessToken: string;
  queryConfig?: QueryConfig<typeof getProfileSettingsQueryOptions>;
};

export const useProfileSettings = ({
  accessToken,
  queryConfig = {},
}: UseProfileSettingsOptions) => {
  return useQuery({
    ...getProfileSettingsQueryOptions(accessToken),
    ...queryConfig,
  });
};
