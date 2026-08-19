import { http } from "@/shared/lib/http";
import { toAxiosConfig } from "@/shared/lib/request-config";
import type { RequestConfig } from "@/shared/lib/request-config";
import type { PageResult } from "@/shared/pagination/page-result";
import type { ProblemSummary } from "../models/problem-summary";
import { defineQuery } from "@/shared/api/define-query";

type GetProblemsParams = {
  page: number;
  size: number;
  timestamp: string;
};

export const getProblems = ({
  page,
  size,
  timestamp,
  signal,
}: GetProblemsParams & RequestConfig) =>
  http.get<PageResult<ProblemSummary>>("/api/v1/problem", {
    ...toAxiosConfig({ signal }),
    params: { page, size, timestamp },
  });

const problemsQuery = defineQuery<
  PageResult<ProblemSummary>,
  GetProblemsParams
>({
  queryKey: ({ page, size, timestamp }) => ["problems", page, size, timestamp],
  queryFn: getProblems,
});

export const useProblems = problemsQuery.useQuery;
