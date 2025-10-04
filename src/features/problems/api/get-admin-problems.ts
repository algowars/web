import { PageResult } from "@/common/pagination/page-result";
import { AdminProblem } from "../models/admin-problem";
import { api } from "@/lib/api-client";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { access } from "fs";
import { PaginationState } from "@tanstack/react-table";

export const getAdminProblems = ({
  pagination,
  timestamp,
  accessToken,
}: {
  pagination: PaginationState;
  timestamp?: Date;
  accessToken: string;
}) => {
  return api.get<PageResult<AdminProblem>>({
    url: "/api/v1/problem/admin",
    config: {
      params: {
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        timestamp: timestamp?.toISOString(),
      },
    },
    accessToken,
  });
};

export const getAdminProblemsQueryOptions = (
  accessToken: string,
  pagination: PaginationState,
  timestamp?: Date
) => {
  return queryOptions({
    queryKey: ["problems", pagination, timestamp, accessToken],
    queryFn: () => getAdminProblems({ pagination, timestamp, accessToken }),
    placeholderData: keepPreviousData,
  });
};

type UseProblemsOptions = {
  pagination: PaginationState;
  timestamp?: Date;
  accessToken: string;
  queryConfig?: QueryConfig<typeof getAdminProblemsQueryOptions>;
};

export const useAdminProblems = ({
  pagination,
  timestamp,
  accessToken,
  queryConfig = {},
}: UseProblemsOptions) => {
  return useQuery({
    ...getAdminProblemsQueryOptions(accessToken, pagination, timestamp),
    ...queryConfig,
  });
};
