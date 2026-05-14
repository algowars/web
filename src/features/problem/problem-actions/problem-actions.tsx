"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import React from "react";
import { useProblemEditorStore } from "../problem-editor-store";
import { useRunSubmission } from "../api/run-submission";
import { toast } from "sonner";
import { useCreateSubmission } from "../api/create-submission";
import { routerConfig } from "@/router-config";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

type ProblemActionsProps = React.HTMLAttributes<HTMLUListElement> & {
  slug: string;
  isAuthenticated: boolean;
};

export default function ProblemActions({
  slug,
  isAuthenticated,
  ...props
}: ProblemActionsProps) {
  const code = useProblemEditorStore((s) => s.code);
  const setup = useProblemEditorStore((s) => s.setup);
  const setLastRunResult = useProblemEditorStore((s) => s.setLastRunResult);
  const setActiveSubmissionId = useProblemEditorStore(
    (s) => s.setActiveSubmissionId
  );
  const problemSetupId = setup?.id ?? 1;

  const runSubmissionMutation = useRunSubmission();
  const submitSubmissionMutation = useCreateSubmission();

  const handleRun = async () => {
    try {
      setLastRunResult(null);
      const result = await runSubmissionMutation.mutateAsync({
        code,
        problemSetupId,
      });
      toast.success("Submission created");
      setLastRunResult(result);
    } catch {
      toast.error("Failed to run submission.");
    }
  };

  const handleSubmit = async () => {
    try {
      const id = await submitSubmissionMutation.mutateAsync({
        code,
        problemSetupId,
      });
      setActiveSubmissionId(id);
      toast.success("Submission created");
    } catch {
      toast.error("Failed to submit.");
    }
  };

  const isActionDisabled =
    !isAuthenticated ||
    runSubmissionMutation.isPending ||
    submitSubmissionMutation.isPending ||
    !code ||
    !problemSetupId;

  return (
    <ul {...props}>
      <li>
        <Button
          className="w-24"
          variant="secondary"
          onClick={handleRun}
          disabled={isActionDisabled}
        >
          {!isAuthenticated && <Lock size={14} data-testid="lock-icon" />}
          {runSubmissionMutation.isPending ? "Running..." : "Run"}
        </Button>
      </li>
      <li>
        <Button
          className="w-24"
          data-cy="submit-btn"
          onClick={handleSubmit}
          disabled={isActionDisabled}
        >
          {!isAuthenticated && <Lock size={14} data-testid="lock-icon" />}
          {submitSubmissionMutation.isPending ? "Running..." : "Submit"}
        </Button>
      </li>
      <li>
        <a
          href={routerConfig.problemSubmissions.execute({ slug })}
          className={cn(buttonVariants({ variant: "ghost" }))}
          data-cy="view-submissions-btn"
        >
          View Submissions
        </a>
      </li>
    </ul>
  );
}
