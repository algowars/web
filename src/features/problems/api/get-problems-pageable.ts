import { api } from "@/lib/api-client";
import { Problem } from "../models/problem";
import { PageResult } from "@/common/pagination/page-result";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getProblemsPageable = ({
  page,
  size,
  timestamp,
}: {
  page?: number;
  size?: number;
  timestamp?: Date;
}) => {
  return api.get<PageResult<Problem>>({
    url: "/api/v1/problem",
    config: {
      params: {
        page,
        size,
        timestamp: timestamp ? timestamp.toISOString() : undefined,
      },
    },
  });
};

export const getProblemsPageableQueryOptions = (
  page?: number,
  size?: number,
  timestamp?: Date
) => {
  return queryOptions({
    queryKey: ["problems", page, size, timestamp],
    queryFn: () => getProblemsPageable({ page, size, timestamp }),
  });
};

type UseProblemsOptions = {
  page?: number;
  size?: number;
  timestamp?: Date;
  queryConfig?: QueryConfig<typeof getProblemsPageableQueryOptions>;
};

export const useProblems = ({
  page,
  size,
  timestamp,
  queryConfig = {},
}: UseProblemsOptions) => {
  return useQuery({
    ...getProblemsPageableQueryOptions(page, size, timestamp),
    ...queryConfig,
  });
};
