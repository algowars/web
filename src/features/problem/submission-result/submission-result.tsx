"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { useProblemEditorStore } from "../problem-editor-store";
import { useGetSubmission } from "../api/get-submission";
import { useEffect } from "react";

type SubmissionResultProps = {
  accessToken: string;
};

export default function SubmissionResult({
  accessToken,
}: SubmissionResultProps) {
  const result = useProblemEditorStore((s) => s.lastRunResult);
  const setLastRunResult = useProblemEditorStore((s) => s.setLastRunResult);

  const { data, isSuccess } = useGetSubmission({
    submissionId: result?.submissionId,
    accessToken: accessToken,
    queryConfig: {
      retry: result?.submissionId ? 10 : 0,
      retryDelay: 2_000,
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      setLastRunResult(data);
    }
  }, [isSuccess, data, setLastRunResult]);

  if (!result) {
    return <div>You must run your code first.</div>;
  }

  const statuses: Record<number, string> = {
    1: "Pending...",
    2: "Running",
    3: "Completed",
    4: "Failed",
  };

  return (
    <div className="p-5">
      <Alert variant="default">
        <AlertTitle>{statuses[result?.status] ?? result.status}</AlertTitle>
      </Alert>
    </div>
  );
}
