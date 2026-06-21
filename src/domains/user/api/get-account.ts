import { api } from "@/shared/lib/api-client";
import { User } from "../models/user";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/shared/lib/react-query";

export const getAccount = () => {
  return api.get<User>("/api/v1/user");
};

const getAccountQueryOptions = () => {
  return queryOptions({
    queryKey: ["account"],
    queryFn: () => getAccount(),
  });
};

type UseGetAccountOptions = {
  queryConfig?: QueryConfig<typeof getAccountQueryOptions>;
};

export const useGetAccount = ({ queryConfig = {} }: UseGetAccountOptions) => {
  return useQuery({
    ...getAccountQueryOptions(),
    ...queryConfig,
  });
};
