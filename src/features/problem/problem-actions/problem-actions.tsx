import { Button, buttonVariants } from "@/components/ui/button";
import React from "react";
import { useProblemEditorStore } from "../problem-editor-store";
import { useRunSubmission } from "../api/run-submission";
import { toast } from "sonner";
import { useCreateSubmission } from "../api/create-submission";
import { routerConfig } from "@/router-config";
import { cn } from "@/lib/utils";

type ProblemActionsProps = React.HTMLAttributes<HTMLUListElement> & {
  accessToken: string;
  slug: string;
};

export default function ProblemActions({
  accessToken,
  slug,
  ...props
}: ProblemActionsProps) {
  const code = useProblemEditorStore((s) => s.code);
  const setup = useProblemEditorStore((s) => s.setup);
  const setLastRunResult = useProblemEditorStore((s) => s.setLastRunResult);
  const problemSetupId = setup?.id ?? 1;

  const runSubmissionMutation = useRunSubmission();

  const submitSubmissionMutation = useCreateSubmission();

  const handleRun = async () => {
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
    }
  };

  const handleSubmit = async () => {
    try {
      setLastRunResult(null);
      const result = await submitSubmissionMutation.mutateAsync({
        code,
        problemSetupId,
        accessToken,
      });
      setLastRunResult(result);
      toast.success("Submission created");
      setLastRunResult(result);
    } catch {
      toast.error("Failed to run submission.");
    }
  };

  return (
    <ul {...props}>
      <li>
        <Button
          className="w-24"
          variant="secondary"
          onClick={handleRun}
          disabled={
            runSubmissionMutation.isPending ||
            submitSubmissionMutation.isPending ||
            !code ||
            !problemSetupId
          }
        >
          {runSubmissionMutation.isPending ? "Running..." : "Run"}
        </Button>
      </li>
      <li>
        <Button
          className="w-24"
          onClick={handleSubmit}
          disabled={
            runSubmissionMutation.isPending ||
            submitSubmissionMutation.isPending ||
            !code ||
            !problemSetupId
          }
        >
          {submitSubmissionMutation.isPending ? "Running..." : "Submit"}
        </Button>
      </li>
      <li>
        <a
          href={routerConfig.problemSubmissions.execute({ slug })}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          View Submissions
        </a>
      </li>
    </ul>
  );
}
