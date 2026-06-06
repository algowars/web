import { api } from "@/shared/lib/api-client";
import { Problem } from "../models/problem";
import { PageResult } from "@/shared/pagination/page-result";
import { QueryConfig } from "@/shared/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getProblems = (params: {
  page: number;
  size: number;
  timestamp: Date;
}) => {
  return api.get<PageResult<Problem>>("/api/v1/problem", {
    params,
  });
};

const getProblemsQueryOptions = (data: {
  page: number;
  size: number;
  timestamp: Date;
}) => {
  return queryOptions({
    queryKey: ["problems", data.page, data.size, data.timestamp],
    queryFn: () => getProblems(data),
  });
};

type UseGetProblemsOptions = {
  page: number;
  size: number;
  timestamp: Date;
  queryConfig?: QueryConfig<typeof getProblemsQueryOptions>;
};

export const useGetProblems = ({
  page,
  size,
  timestamp,
  queryConfig = {},
}: UseGetProblemsOptions) => {
  return useQuery({
    ...getProblemsQueryOptions({ page, size, timestamp }),
    ...queryConfig,
  });
};
