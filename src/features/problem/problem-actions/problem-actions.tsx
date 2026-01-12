import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useProblemEditorStore } from "../problem-editor-store";
import { useRunSubmission } from "../api/run-submission";
import { toast } from "sonner";
import { useCreateSubmission } from "../api/create-submission";

type ProblemActionsProps = React.HTMLAttributes<HTMLUListElement> & {
  accessToken: string;
};

export default function ProblemActions({
  accessToken,
  ...props
}: ProblemActionsProps) {
  const code = useProblemEditorStore((s) => s.code);
  const setup = useProblemEditorStore((s) => s.setup);
  const setLastRunResult = useProblemEditorStore((s) => s.setLastRunResult);
  const problemSetupId = setup?.id ?? 1;
  const [isRunning, setIsRunning] = useState(false);

  const runSubmissionMutation = useRunSubmission();

  const submitSubmissionMutation = useCreateSubmission();

  const handleRun = async () => {
    setIsRunning(true);
    try {
      setLastRunResult(null);
      const result = await runSubmissionMutation.mutateAsync({
        code,
        problemSetupId,
        accessToken,
      });
      toast.success("Submission created");
      setLastRunResult(result);
    } catch {
      toast.error("Failed to run submission.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    try {
      setLastRunResult(null);
      const result = await submitSubmissionMutation.mutateAsync({
        code,
        problemSetupId,
        accessToken,
      });
      toast.success("Submission created");
      setLastRunResult(result);
    } catch {
      toast.error("Failed to run submission.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <ul {...props}>
      <li>
        <Button
          className="w-24"
          variant="secondary"
          onClick={handleRun}
          disabled={isRunning || !code || !problemSetupId}
        >
          {isRunning ? "Running..." : "Run"}
        </Button>
      </li>
      <li>
        <Button className="w-24" onClick={handleSubmit} disabled={!code}>
          Submit
        </Button>
      </li>
    </ul>
  );
}
