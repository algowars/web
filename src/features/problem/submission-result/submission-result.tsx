import { Alert, AlertTitle } from "@/components/ui/alert";
import { useProblemEditorStore } from "../problem-editor-store";

export default function SubmissionResult() {
  const result = useProblemEditorStore((s) => s.lastRunResult);

  console.log("RESULT:", result);

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
