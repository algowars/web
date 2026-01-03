import { api } from "@/lib/api-client";
import { Problem } from "../models/problem";
import { PageResult } from "@/common/pagination/page-result";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { PaginationState } from "@tanstack/react-table";

export const getProblemsPageable = ({
  pagination,
  timestamp,
}: {
  pagination: PaginationState;
  timestamp?: Date;
}) => {
  return api.get<PageResult<Problem>>({
    url: "/api/v1/problem",
    config: {
      params: {
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        timestamp: timestamp?.toISOString(),
      },
    },
  });
};

export const getProblemsPageableQueryOptions = (
  pagination: PaginationState,
  timestamp?: Date
) =>
  queryOptions({
    queryKey: ["problems", pagination, timestamp],
    queryFn: () => getProblemsPageable({ pagination, timestamp }),
    placeholderData: keepPreviousData,
  });

type UseProblemsOptions = {
  pagination: PaginationState;
  timestamp?: Date;
  queryConfig?: QueryConfig<typeof getProblemsPageableQueryOptions>;
};

export const useProblems = ({
  pagination,
  timestamp,
  queryConfig = {},
}: UseProblemsOptions) =>
  useQuery({
    ...getProblemsPageableQueryOptions(pagination, timestamp),
    ...queryConfig,
  });
