import { api } from "@/lib/api-client";
import { ProfileSettings } from "../models/profile-settings";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getProfileSettings = () => {
  return api.get<ProfileSettings>({
    url: `/api/v1/account/settings`,
  });
};

export const getProfileSettingsQueryOptions = () => {
  return queryOptions({
    queryKey: ["profile"],
    queryFn: () => getProfileSettings(),
  });
};

export type UseProfileSettingsOptions = {
  queryConfig?: QueryConfig<typeof getProfileSettingsQueryOptions>;
};

export const useProfileSettings = ({
  queryConfig = {},
}: UseProfileSettingsOptions) => {
  return useQuery({
    ...getProfileSettingsQueryOptions(),
    ...queryConfig,
  });
};

export const useSuspenseProfileSettings = ({
  queryConfig = {},
}: UseProfileSettingsOptions) =>
  useSuspenseQuery({
    ...getProfileSettingsQueryOptions(),
    ...queryConfig,
  });
