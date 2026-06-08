import { api } from "@/shared/lib/api-client";
import { Account } from "../models/account";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/shared/lib/react-query";

export const getProfile = () => {
  return api.get<Account>("/api/v1/account/profile");
};

const getProfileQueryOptions = () => {
  return queryOptions({
    queryKey: ["account", "profile"],
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
