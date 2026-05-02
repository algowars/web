import { QueryConfig } from "@/lib/react-query";
import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ProblemSubmission } from "../models/problem-submission";

export const getProblemSubmissions = async ({
  problemId,
}: {
  problemId?: string;
}): Promise<ProblemSubmission | null> => {
  if (!problemId) {
    return null;
  }

  return api.get<ProblemSubmission>({
    url: `/api/v1/problem/${encodeURIComponent(problemId)}/submissions`,
  });
};

export const getProblemSubmissionsQueryOptions = (problemId?: string) => {
  return queryOptions({
    queryKey: ["problem-submissions", problemId],
    queryFn: () => getProblemSubmissions({ problemId }),
  });
};

type UseProblemSubmissionsOptions = {
  problemId?: string;
  queryConfig?: QueryConfig<typeof getProblemSubmissionsQueryOptions>;
};

export const useProblemSubmissions = ({
  problemId,
  queryConfig,
}: UseProblemSubmissionsOptions) => {
  return useQuery({
    ...getProblemSubmissionsQueryOptions(problemId),
    ...queryConfig,
  });
};
