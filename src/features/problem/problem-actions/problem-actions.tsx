import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useProblemEditorStore } from "../problem-editor-store";
import { useRunSubmission } from "../api/run-submission";
import { toast } from "sonner";

type ProblemActionsProps = React.HTMLAttributes<HTMLUListElement> & {
  accessToken: string;
};

export default function ProblemActions({
  accessToken,
  ...props
}: ProblemActionsProps) {
  const code = useProblemEditorStore((s) => s.code);
  const setup = useProblemEditorStore((s) => s.setup);
  const problemSetupId = setup?.id ?? 1;
  const [isRunning, setIsRunning] = useState(false);

  const submissionMutation = useRunSubmission();

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const result = await submissionMutation.mutateAsync({
        code,
        problemSetupId,
        accessToken,
      });
      toast.success("Submission created! Token saved for evaluation.");
      console.log("Submission result:", result);
    } catch (error: any) {
      toast.error(error?.message || "Failed to run submission.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    toast("Submit button clicked — implement your submission flow!");
  };

  console.log(isRunning, code, problemSetupId, accessToken);
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
