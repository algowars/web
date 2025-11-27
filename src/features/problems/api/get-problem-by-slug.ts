import { api } from "@/lib/api-client";
import { Problem } from "../models/problem";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getProblemBySlug = ({ slug }: { slug: string }) => {
  return api.get<Problem>({
    url: `/api/v1/problem/slug/${encodeURIComponent(slug)}`,
  });
};

export const getProblemBySlugQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ["problem", slug],
    queryFn: () => getProblemBySlug({ slug }),
  });
};

type UseProblemBySlugOptions = {
  slug: string;
  queryConfig?: QueryConfig<typeof getProblemBySlugQueryOptions>;
};

export const useProblemBySlug = ({
  slug,
  queryConfig,
}: UseProblemBySlugOptions) => {
  return useQuery({
    ...getProblemBySlugQueryOptions(slug),
    ...queryConfig,
  });
};
