import { api } from "@/lib/api-client";
import { RunResult } from "../models/run-result";
import { useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getSubmission = async ({
  submissionId,
}: {
  submissionId?: string;
}): Promise<RunResult | null> => {
  if (!submissionId) {
    return null;
  }

  return api.get<RunResult>({
    url: `/api/v1/submission/${encodeURIComponent(submissionId)}`,
  });
};

export const getSubmissionQueryOptions = (submissionId?: string) => {
  return {
    queryKey: ["run-submission", submissionId],
    queryFn: () => getSubmission({ submissionId }),
  };
};

type UseGetRunSubmissionOptions = {
  submissionId?: string;
  queryConfig?: QueryConfig<typeof getSubmissionQueryOptions>;
};

export const useGetSubmission = ({
  submissionId,
  queryConfig,
}: UseGetRunSubmissionOptions) => {
  return useQuery({
    ...getSubmissionQueryOptions(submissionId),
    ...queryConfig,
  });
};
