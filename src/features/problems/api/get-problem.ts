import { api } from "@/lib/api-client";
import { ProblemSetup } from "../models/problem-setup";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getProblem = ({
  slug,
  preferredLanguageId,
}: {
  slug: string;
  preferredLanguageId?: number;
}) => {
  return api.get<ProblemSetup>({
    url: `/api/v1/problem/slug/${encodeURIComponent(slug)}`,
    config: {
      params: {
        preferredLanguageId,
      },
    },
  });
};

export const getProblemQueryOptions = (
  slug: string,
  preferredLanguageId?: number
) => {
  return queryOptions({
    queryKey: ["problem", slug, preferredLanguageId],
    queryFn: () => getProblem({ slug, preferredLanguageId }),
  });
};

type UseProblemOptions = {
  slug: string;
  preferredLanguageId?: number;
  queryConfig?: QueryConfig<typeof getProblemQueryOptions>;
};

export const useProblem = ({
  slug,
  preferredLanguageId,
  queryConfig = {},
}: UseProblemOptions) => {
  return useQuery({
    ...getProblemQueryOptions(slug, preferredLanguageId),
    ...queryConfig,
  });
};
