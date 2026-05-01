import { api } from "@/lib/api-client";
import { RunResult } from "../models/run-result";
import { useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getRunSubmission = async ({
  submissionId,
}: {
  submissionId: string;
}): Promise<RunResult | null> => {
  return api.get<RunResult>({
    url: `/api/v1/submission/run/${encodeURIComponent(submissionId)}`,
  });
};

export const getRunSubmissionQueryOptions = (submissionId: string) => {
  return {
    queryKey: ["run-submission", submissionId],
    queryFn: () => getRunSubmission({ submissionId }),
  };
};

type UseGetRunSubmissionOptions = {
  submissionId: string;
  queryConfig?: QueryConfig<typeof getRunSubmissionQueryOptions>;
};

export const useGetRunSubmission = ({
  submissionId,
  queryConfig,
}: UseGetRunSubmissionOptions) => {
  return useQuery({
    ...getRunSubmissionQueryOptions(submissionId),
    ...queryConfig,
  });
};
