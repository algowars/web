import { api } from "@/lib/api-client";
import { Language } from "../models/language";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getAvailableLanguages = () => {
  return api.get<Language[]>({
    url: "/api/v1/problem/languages",
  });
};

export const getAvailableLanguagesQueryOptions = () => {
  return queryOptions({
    queryKey: ["languages"],
    queryFn: () => getAvailableLanguages(),
  });
};

type useAvailableLanguagesOptions = {
  queryConfig?: QueryConfig<typeof getAvailableLanguagesQueryOptions>;
};

export const useAvailableLanguages = ({
  queryConfig = {},
}: useAvailableLanguagesOptions = {}) => {
  return useQuery({
    ...getAvailableLanguagesQueryOptions(),
    ...queryConfig,
  });
};
