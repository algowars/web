import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { ProfileAggregate } from "../models/profile-aggregate";

export const getProfile = ({ username }: { username: string }) => {
  return api.get<ProfileAggregate>({
    url: `/api/v1/account/find/profile/${encodeURIComponent(username)}`,
  });
};

export const getProfileQueryOptions = (username: string) => {
  return queryOptions({
    queryKey: ["profile", username],
    queryFn: () => getProfile({ username }),
  });
};

type UseProfileOptions = {
  username: string;
  queryConfig?: QueryConfig<typeof getProfileQueryOptions>;
};

export const useProfile = ({
  username,
  queryConfig = {},
}: UseProfileOptions) => {
  return useQuery({
    ...getProfileQueryOptions(username),
    ...queryConfig,
  });
};
