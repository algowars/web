import { PageResult } from "@/common/pagination/page-result";
import { AdminProblem } from "../models/admin-problem";
import { api } from "@/lib/api-client";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { PaginationState } from "@tanstack/react-table";
import { createEmptyPageResult } from "@/common/pagination/empty-page-result";

export const getAdminProblems = ({
  pagination,
  timestamp,
}: {
  pagination: PaginationState;
  timestamp?: Date;
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
  });
};

export const getAdminProblemsQueryOptions = (
  pagination: PaginationState,
  timestamp?: Date
) => {
  return queryOptions({
    queryKey: ["problems", pagination, timestamp],
    queryFn: () => getAdminProblems({ pagination, timestamp }),
    placeholderData: keepPreviousData,
  });
};

type UseProblemsOptions = {
  pagination: PaginationState;
  timestamp?: Date;
  queryConfig?: QueryConfig<typeof getAdminProblemsQueryOptions>;
};

export const useAdminProblems = ({
  pagination,
  timestamp,
  queryConfig = {},
}: UseProblemsOptions) => {
  return useQuery({
    ...getAdminProblemsQueryOptions(pagination, timestamp),
    ...queryConfig,
  });
};
