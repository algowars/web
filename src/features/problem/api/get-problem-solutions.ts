import { PageResult } from "@/shared/pagination/page-result";
import { api } from "@/lib/api-client";
import { ProblemSubmission } from "../models/problem-submission";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { Pagination } from "@/shared/pagination/pagination";

export const getProblemSolutions = ({
  problemId,
  pagination,
}: {
  problemId: string;
  pagination: Pagination;
}) => {
  return api.get<PageResult<ProblemSubmission>>({
    url: `/api/v1/problem/${encodeURIComponent(problemId)}/solutions`,
    config: {
      params: pagination,
    },
  });
};

export const getProblemSolutionsQueryOptions = (
  problemId: string,
  pagination: Pagination
) =>
  queryOptions({
    queryKey: ["problems", "solutions", problemId, pagination],
    queryFn: () => getProblemSolutions({ problemId, pagination }),
  });

type UseProblemSolutionsOptions = {
  problemId: string;
  pagination: Pagination;
  timestamp?: Date;
  queryConfig?: QueryConfig<typeof getProblemSolutionsQueryOptions>;
};

export const useProblemSolutions = ({
  problemId,
  pagination,
  queryConfig = {},
}: UseProblemSolutionsOptions) =>
  useQuery({
    ...getProblemSolutionsQueryOptions(problemId, pagination),
    ...queryConfig,
  });

export const useSuspenseProblemSolutions = ({
  problemId,
  pagination,
  queryConfig = {},
}: UseProblemSolutionsOptions) =>
  useSuspenseQuery({
    ...getProblemSolutionsQueryOptions(problemId, pagination),
    ...queryConfig,
  });
