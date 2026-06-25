import { api } from "@/shared/lib/api-client";
import { User } from "../models/user";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/shared/lib/react-query";

export const getProfile = () => {
  return api.get<User>({
    url: "/api/v1/user/profile",
  });
};

const getProfileQueryOptions = () => {
  return queryOptions({
    queryKey: ["user", "profile"],
    queryFn: () => getProfile(),
  });
};

type UseGetProfileOptions = {
  queryConfig?: QueryConfig<typeof getProfileQueryOptions>;
};

export const useGetProfile = ({ queryConfig = {} }: UseGetProfileOptions) => {
  return useQuery({
    ...getProfileQueryOptions(),
    ...queryConfig,
  });
};
