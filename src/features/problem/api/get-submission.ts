import { api } from "@/lib/api-client";
import { RunResult } from "../models/run-result";
import { useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getSubmission = async ({
  submissionId,
  accessToken,
}: {
  submissionId?: string;
  accessToken: string;
}): Promise<RunResult | null> => {
  if (!submissionId) {
    return null;
  }

  return api.get<RunResult>({
    url: `/api/v1/submission/${encodeURIComponent(submissionId)}`,
    accessToken,
  });
};

export const getSubmissionQueryOptions = (
  accessToken: string,
  submissionId?: string,
) => {
  return {
    queryKey: ["run-submission", submissionId],
    queryFn: () => getSubmission({ submissionId, accessToken }),
  };
};

type UseGetRunSubmissionOptions = {
  submissionId?: string;
  accessToken: string;
  queryConfig?: QueryConfig<typeof getSubmissionQueryOptions>;
};

export const useGetSubmission = ({
  submissionId,
  accessToken,
  queryConfig,
}: UseGetRunSubmissionOptions) => {
  return useQuery({
    ...getSubmissionQueryOptions(accessToken, submissionId),
    ...queryConfig,
  });
};
