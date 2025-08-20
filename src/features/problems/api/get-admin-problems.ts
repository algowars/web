import { PageResult } from "@/common/pagination/page-result";
import { AdminProblem } from "../models/admin-problem";
import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { access } from "fs";

export const getAdminProblems = ({
  page,
  size,
  timestamp,
  accessToken,
}: {
  page?: number;
  size?: number;
  timestamp?: Date;
  accessToken: string;
}) => {
  return api.get<PageResult<AdminProblem>>({
    url: "/api/v1/problem/admin",
    config: {
      params: {
        page,
        size,
        timestamp: timestamp ? timestamp.toISOString() : undefined,
      },
    },
    accessToken,
  });
};

export const getAdminProblemsQueryOptions = (
  accessToken: string,
  page?: number,
  size?: number,
  timestamp?: Date
) => {
  return queryOptions({
    queryKey: ["problems", page, size, timestamp, accessToken],
    queryFn: () => getAdminProblems({ page, size, timestamp, accessToken }),
  });
};

type UseProblemsOptions = {
  page?: number;
  size?: number;
  timestamp?: Date;
  accessToken: string;
  queryConfig?: QueryConfig<typeof getAdminProblemsQueryOptions>;
};

export const useAdminProblems = ({
  page,
  size,
  timestamp,
  accessToken,
  queryConfig = {},
}: UseProblemsOptions) => {
  return useQuery({
    ...getAdminProblemsQueryOptions(accessToken, page, size, timestamp),
    ...queryConfig,
  });
};
