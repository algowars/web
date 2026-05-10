"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getSubmission } from "../api/get-submission";
import { SubmissionStatus } from "../models/submission-status";
import { RunResult } from "../models/run-result";
import SubmissionResultView from "../submission-result-view/submission-result-view";

type SubmissionResultTabProps = {
  submissionId: string;
  onComplete: (result: RunResult) => void;
};

export default function SubmissionResultTab({
  submissionId,
  onComplete,
}: SubmissionResultTabProps) {
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
  }, [submissionId]);

  const { data } = useQuery({
    queryKey: ["submission-status", submissionId],
    queryFn: () => getSubmission({ submissionId }),
    enabled: !!submissionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === SubmissionStatus.PROCESSING) return 2000;
      return false;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (
      data &&
      data.status !== SubmissionStatus.PROCESSING &&
      !completedRef.current
    ) {
      completedRef.current = true;
      onComplete(data);
    }
  }, [data, onComplete]);

  const isProcessing = !data || data.status === SubmissionStatus.PROCESSING;

  return (
    <div data-cy="submission-result-tab" className="h-full flex flex-col">
      {isProcessing ? (
        <div
          data-cy="submission-tab-loading"
          className="flex flex-col items-center justify-center flex-1 gap-2"
        >
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Evaluating submission...
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <SubmissionResultView result={data} />
        </div>
      )}
    </div>
  );
}
