import { QueryConfig } from "@/lib/react-query";
import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Submission } from "../models/submission";

interface PaginatedSubmissions {
  results: Submission[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const getProblemSubmissions = async ({
  problemId,
  accessToken,
  userId,
}: {
  problemId?: string;
  accessToken?: string;
  userId?: string;
}): Promise<PaginatedSubmissions | null> => {
  if (!problemId) {
    return null;
  }

  const params = new URLSearchParams();
  if (userId) {
    params.append("userId", userId);
  }

  const url = `/api/v1/problem/${encodeURIComponent(problemId)}/submissions${params.toString() ? "?" + params.toString() : ""}`;

  const response = await api.get<PaginatedSubmissions>({
    url,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });

  return response;
};

export const getProblemSubmissionsQueryOptions = (
  problemId?: string,
  accessToken?: string,
  userId?: string
) => {
  return queryOptions({
    queryKey: ["problem-submissions", problemId, userId],
    queryFn: () => getProblemSubmissions({ problemId, accessToken, userId }),
  });
};

type UseProblemSubmissionsOptions = {
  problemId?: string;
  accessToken?: string;
  userId?: string;
  queryConfig?: QueryConfig<typeof getProblemSubmissionsQueryOptions>;
};

export const useProblemSubmissions = ({
  problemId,
  accessToken,
  userId,
  queryConfig,
}: UseProblemSubmissionsOptions) => {
  return useQuery({
    ...getProblemSubmissionsQueryOptions(problemId, accessToken, userId),
    ...queryConfig,
  });
};
