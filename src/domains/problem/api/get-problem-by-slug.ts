import { api } from "@/shared/lib/api-client";
import { Problem } from "../models/problem";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/shared/lib/react-query";

export const getProblemBySlug = ({ slug }: { slug: string }) => {
  console.log("SLUG: ", slug);
  return api.get<Problem>(`/api/v1/problem/${slug}`);
};

export const getProblemBySlugQueryOptions = ({ slug }: { slug: string }) => {
  return queryOptions({
    queryKey: ["problem", slug],
    queryFn: () => getProblemBySlug({ slug }),
  });
};

type UseGetProblemBySlugOptions = {
  slug: string;
  queryConfig?: QueryConfig<typeof getProblemBySlugQueryOptions>;
};

export const useGetProblemBySlug = ({
  slug,
  queryConfig = {},
}: UseGetProblemBySlugOptions) => {
  return useQuery({
    ...getProblemBySlugQueryOptions({ slug }),
    ...queryConfig,
  });
};
