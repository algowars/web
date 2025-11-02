import { PageResult } from "@/common/pagination/page-result";
import { api } from "@/lib/api-client";
import { Language } from "../models/language";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getAvailableLanguages = (accessToken: string) => {
  return api.get<Language[]>({
    url: "/api/v1/problem/languages",
    accessToken,
  });
};

export const getAvailableLanguagesQueryOptions = (accessToken: string) => {
  return queryOptions({
    queryKey: ["languages", accessToken],
    queryFn: () => getAvailableLanguages(accessToken),
  });
};

type useAvailableLanguagesOptions = {
  accessToken: string;
  queryConfig?: QueryConfig<typeof getAvailableLanguagesQueryOptions>;
};

export const useAvailableLanguages = ({
  accessToken,
  queryConfig = {},
}: useAvailableLanguagesOptions) => {
  return useQuery({
    ...getAvailableLanguagesQueryOptions(accessToken),
    ...queryConfig,
  });
};
