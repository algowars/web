import { Alert, AlertTitle } from "@/components/ui/alert";
import { useProblemEditorStore } from "../problem-editor-store";
import { useGetRunSubmission } from "../api/get-run-submission";
import { SubmissionStatus } from "../models/submission-status";

type SubmissionResultProps = {
  accessToken: string;
};

export default function SubmissionResult({
  accessToken,
}: SubmissionResultProps) {
  const result = useProblemEditorStore((s) => s.lastRunResult);

  console.log("RESULT:", result);

  const { data: updatedResult } = useGetRunSubmission({
    submissionId: result?.submissionId || "",
    accessToken,
    queryConfig: {
      enabled: !!result && result?.status === SubmissionStatus.Pending,
      refetchInterval: result?.status === 1 ? 5_000 : false,
      retry: 6,
    },
  });

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
        <AlertTitle>{statuses[result?.status]}</AlertTitle>
      </Alert>
    </div>
  );
}
