import { ProblemSetup } from "@/features/problems/models/problem-setup";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getProblemSetup = ({
  problemId,
  languageId,
}: {
  problemId: string;
  languageId: number;
}): Promise<ProblemSetup | null> => {
  return Promise.resolve(null);
};

export const getProblemSetupQueryOptions = (
  problemId: string,
  languageId: number
) => {
  return queryOptions({
    queryKey: ["problem-setup", problemId, languageId],
    queryFn: () => getProblemSetup({ problemId, languageId }),
  });
};

type UseProblemSetupOptions = {
  problemId: string;
  languageId: number;
  queryConfig?: QueryConfig<typeof getProblemSetupQueryOptions>;
};

export const useProblemSetup = ({
  problemId,
  languageId,
  queryConfig,
}: UseProblemSetupOptions) => {
  return useQuery({
    ...getProblemSetupQueryOptions(problemId, languageId),
    ...queryConfig,
  });
};
