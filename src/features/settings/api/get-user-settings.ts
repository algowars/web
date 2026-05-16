import { api } from "@/lib/api-client";
import { ProfileSettings } from "@/features/profile/models/profile-settings";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getUserSettings = () => {
  return api.get<ProfileSettings>({
    url: `/api/v1/account/settings`,
  });
};

export const getUserSettingsQueryOptions = () => {
  return queryOptions({
    queryKey: ["settings"],
    queryFn: () => getUserSettings(),
  });
};

export type UseUserSettingsOptions = {
  queryConfig?: QueryConfig<typeof getUserSettingsQueryOptions>;
};

export const useUserSettings = ({
  queryConfig = {},
}: UseUserSettingsOptions = {}) => {
  return useQuery({
    ...getUserSettingsQueryOptions(),
    ...queryConfig,
  });
};

export const useSuspenseUserSettings = ({
  queryConfig = {},
}: UseUserSettingsOptions = {}) =>
  useSuspenseQuery({
    ...getUserSettingsQueryOptions(),
    ...queryConfig,
  });
