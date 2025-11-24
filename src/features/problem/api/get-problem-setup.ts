import { ProblemSetup } from "@/features/problems/models/problem-setup";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getProblemSetup = ({
  problemId,
  languageVersionId,
}: {
  problemId: string;
  languageVersionId?: number;
}): Promise<ProblemSetup | null> => {
  if (!languageVersionId) {
    return Promise.resolve(null);
  }

  return api.get<ProblemSetup>({
    url: `/api/v1/problem/${encodeURIComponent(problemId)}/setup`,
    config: {
      params: {
        languageVersionId,
      },
    },
  });
};

export const getProblemSetupQueryOptions = (
  problemId: string,
  languageVersionId?: number
) => {
  return queryOptions({
    queryKey: ["problem-setup", problemId, languageVersionId],
    queryFn: () => getProblemSetup({ problemId, languageVersionId }),
  });
};

type UseProblemSetupOptions = {
  problemId: string;
  languageVersionId?: number;
  queryConfig?: QueryConfig<typeof getProblemSetupQueryOptions>;
};

export const useProblemSetup = ({
  problemId,
  languageVersionId,
  queryConfig,
}: UseProblemSetupOptions) => {
  return useQuery({
    ...getProblemSetupQueryOptions(problemId, languageVersionId),
    ...queryConfig,
  });
};
