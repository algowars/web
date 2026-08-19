// src/shared/api/define-authenticated-query.ts
"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";
import { useAbortController } from "@/shared/hooks/use-abort-controller";
import type { RequestConfig } from "@/shared/lib/request-config";
import type { QueryConfig } from "@/shared/lib/react-query";

type DefineQueryArgs<TData, TParams extends object> = {
  queryKey: (params: TParams) => readonly unknown[];
  queryFn: (params: TParams & RequestConfig) => Promise<TData>;
};

export function defineAuthenticatedQuery<
  TData,
  TParams extends object = Record<never, never>,
>({ queryKey, queryFn }: DefineQueryArgs<TData, TParams>) {
  const buildQueryOptions = (params: TParams & RequestConfig) =>
    queryOptions({
      queryKey: queryKey(params),
      queryFn: () => queryFn(params),
    });

  type UseResourceParams = TParams & {
    queryConfig?: QueryConfig<typeof buildQueryOptions>;
  };

  type UseResourceArgs = keyof TParams extends never
    ? [params?: UseResourceParams]
    : [params: UseResourceParams];

  function useResource(...args: UseResourceArgs) {
    const { queryConfig, ...rest } = (args[0] ?? {}) as UseResourceParams;
    const restParams = rest as TParams;
    const abortController = useAbortController(
      queryKey(restParams) as string[]
    );

    return useQuery({
      ...buildQueryOptions({ ...restParams, abortController }),
      ...queryConfig,
    });
  }

  return { queryOptions: buildQueryOptions, useQuery: useResource };
}
