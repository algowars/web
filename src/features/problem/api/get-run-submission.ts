import { api } from "@/lib/api-client";
import { RunResult } from "../models/run-result";
import { useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

export const getRunSubmission = async ({
  submissionId,
  accessToken,
}: {
  submissionId: string;
  accessToken: string;
}): Promise<RunResult | null> => {
  return api.get<RunResult>({
    url: `/api/v1/submission/run/${encodeURIComponent(submissionId)}`,
    accessToken,
  });
};

export const getRunSubmissionQueryOptions = (
  submissionId: string,
  accessToken: string
) => {
  return {
    queryKey: ["run-submission", submissionId],
    queryFn: () => getRunSubmission({ submissionId, accessToken }),
  };
};

type UseGetRunSubmissionOptions = {
  submissionId: string;
  accessToken: string;
  queryConfig?: QueryConfig<typeof getRunSubmissionQueryOptions>;
};

export const useGetRunSubmission = ({
  submissionId,
  accessToken,
  queryConfig,
}: UseGetRunSubmissionOptions) => {
  return useQuery({
    ...getRunSubmissionQueryOptions(submissionId, accessToken),
    ...queryConfig,
  });
};
