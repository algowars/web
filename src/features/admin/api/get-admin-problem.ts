import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { AdminProblemAggregate } from "../models/admin-problem-aggregate";

export const getAdminProblem = ({
  slug,
  accessToken,
}: {
  slug: string;
  accessToken?: string;
}) => {
  if (!accessToken) {
    return null;
  }

  return api.get<AdminProblemAggregate>({
    url: `/api/v1/problem/admin/find/slug/${encodeURIComponent(slug)}`,
    accessToken,
  });
};

export const getAdminProblemQueryOptions = (
  slug: string,
  accessToken?: string
) => {
  return queryOptions({
    queryKey: ["problem", slug, accessToken],
    queryFn: () => getAdminProblem({ slug, accessToken }),
  });
};

type UseProblemOptions = {
  slug: string;
  accessToken?: string;
  queryConfig?: QueryConfig<typeof getAdminProblemQueryOptions>;
};

export const useAdminProblem = ({
  slug,
  accessToken,
  queryConfig = {},
}: UseProblemOptions) => {
  return useQuery({
    ...getAdminProblemQueryOptions(slug, accessToken),
    ...queryConfig,
  });
};
