import { queryOptions, useQuery } from "@tanstack/react-query";

export const getAccount = ({ accessToken, abortController }) => {
  // api request
};

export const getAccountQueryOptions = ({ accessToken, abortController }) => {
  return queryOptions({
    queryKey: ["account", accessToken],
    queryFn: () => getAccount({ accessToken, abortController }),
  });
};

type GetAccountParams = {
  accessToken: string;
  abortController: AbortController;
  queryConfig?: QueryConfig<typeof getAccount>;
};

export const useAccount = ({
  accessToken,
  abortController,
  queryConfig,
}: GetAccountParams) => {
  return useQuery({
    ...getAccountQueryOptions({ accessToken, abortController }),
    ...queryConfig?.(),
  });
};
