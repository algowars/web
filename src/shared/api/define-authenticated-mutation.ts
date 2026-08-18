"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useAbortController } from "@/shared/hooks/use-abort-controller";
import type { RequestConfig } from "@/shared/lib/request-config";
import type { MutationConfig } from "@/shared/lib/react-query";

type DefineMutationArgs<TData, TVariables extends object> = {
  mutationFn: (variables: TVariables & RequestConfig) => Promise<TData>;
  invalidateQueries?: (
    data: TData,
    variables: TVariables
  ) => readonly (readonly unknown[])[];
};

export function defineAuthenticatedMutation<TData, TVariables extends object>({
  mutationFn,
  invalidateQueries,
}: DefineMutationArgs<TData, TVariables>) {
  type OnSuccessArgs = Parameters<
    NonNullable<UseMutationOptions<TData, Error, TVariables>["onSuccess"]>
  >;

  function useResourceMutation(options?: {
    mutationConfig?: MutationConfig<typeof mutationFn>;
  }) {
    const queryClient = useQueryClient();
    const abortController = useAbortController([]);
    const { onSuccess, ...restConfig } = options?.mutationConfig ?? {};

    return useMutation<TData, Error, TVariables>({
      mutationFn: (variables) => mutationFn({ ...variables, abortController }),
      onSuccess: (...args: OnSuccessArgs) => {
        const [data, variables] = args;
        invalidateQueries?.(data, variables).forEach((queryKey) =>
          queryClient.invalidateQueries({ queryKey: queryKey as unknown[] })
        );
        (onSuccess as ((...args: OnSuccessArgs) => void) | undefined)?.(
          ...args
        );
      },
      ...(restConfig as Omit<
        UseMutationOptions<TData, Error, TVariables>,
        "mutationFn" | "onSuccess"
      >),
    });
  }

  return { useMutation: useResourceMutation };
}
