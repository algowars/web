import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ProblemSubmission } from "../models/problem-submission";

export const getProblemSubmissions = ({
  slug,
}: {
  slug: string;
}): Promise<ProblemSubmission> => {
  return api.get<ProblemSubmission>({
    url: `/api/v1/problems/slug/${encodeURIComponent(slug)}/submissions`,
  });
};

export const getProblemSubmissionsQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ["problem-submissions", slug],
    queryFn: () => getProblemSubmissions({ slug }),
  });
};

type UseProblemSubmissionsOptions = {
  slug: string;
  queryConfig?: QueryConfig<typeof getProblemSubmissionsQueryOptions>;
};

export const useProblemSubmissions = ({
  slug,
  queryConfig,
}: UseProblemSubmissionsOptions) => {
  return useQuery({
    ...getProblemSubmissionsQueryOptions(slug),
    ...queryConfig,
  });
};
