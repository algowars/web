import { PageResult } from "@/common/pagination/page-result";
import { api } from "@/lib/api-client";
import { ProblemSubmission } from "../models/problem-submission";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { Pagination } from "@/common/pagination/pagination";

export const getProblemSubmissions = ({
  problemId,
  pagination,
}: {
  problemId: string;
  pagination: Pagination;
  timestamp?: Date;
}) => {
  return api.get<PageResult<ProblemSubmission>>({
    url: `/api/v1/problem/${encodeURIComponent(problemId)}/submissions`,
    config: {
      params: pagination,
    },
  });
};

export const getProblemSubmissionsQueryOptions = (
  problemId: string,
  pagination: Pagination
) =>
  queryOptions({
    queryKey: ["problems", "submissions", problemId, pagination],
    queryFn: () => getProblemSubmissions({ problemId, pagination }),
  });

export type UseProblemSubmissionsOptions = {
  problemId: string;
  pagination: Pagination;
  timestamp?: Date;
  queryConfig?: QueryConfig<typeof getProblemSubmissionsQueryOptions>;
};

export const useProblemSubmissions = ({
  problemId,
  pagination,
  queryConfig = {},
}: UseProblemSubmissionsOptions) =>
  useQuery({
    ...getProblemSubmissionsQueryOptions(problemId, pagination),
    ...queryConfig,
  });

export const useSuspenseProblemSubmissions = ({
  problemId,
  pagination,
  queryConfig = {},
}: UseProblemSubmissionsOptions) =>
  useSuspenseQuery({
    ...getProblemSubmissionsQueryOptions(problemId, pagination),
    ...queryConfig,
  });
