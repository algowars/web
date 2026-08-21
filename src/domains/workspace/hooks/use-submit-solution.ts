"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreateRunSubmission } from "@/domains/submission/api/create-run-submission";
import { useCreateGradeSubmission } from "@/domains/submission/api/create-grade-submission";
import { waitForTerminalSubmission } from "@/domains/submission/api/wait-for-terminal-submission";
import { submissionStatusQueryKey } from "@/domains/submission/api/get-submission-status";
import {
  useWorkspaceStore,
  selectWorkspaceCode,
} from "../state/workspace-store";

/**
 * Runs or submits the current code for grading. Replaces the
 * `runCodeRequested`/`submitCodeRequested` listener effect: creates a run or
 * grade submission, switches the workspace over to the Submission tab, and
 * kicks off a background wait for the submission to reach a terminal state
 * (SignalR push, 60s timeout fallback) so the status panel updates promptly
 * even if its own 10s poll hasn't ticked yet — the poll is still the fallback
 * if this misses.
 */
export function useSubmitSolution(problemSetupId: string | null) {
  const queryClient = useQueryClient();
  const code = useWorkspaceStore(selectWorkspaceCode);
  const beginSubmission = useWorkspaceStore((s) => s.beginSubmission);
  const setSubmittingSubmission = useWorkspaceStore(
    (s) => s.setSubmittingSubmission
  );
  const setActiveSubmissionId = useWorkspaceStore(
    (s) => s.setActiveSubmissionId
  );
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);

  const { mutateAsync: createRunSubmission } = useCreateRunSubmission();
  const { mutateAsync: createGradeSubmission } = useCreateGradeSubmission();

  const submit = async (isRun: boolean) => {
    if (!problemSetupId) {
      toast.error("Problem setup is not ready yet");
      return;
    }

    beginSubmission();

    try {
      setActiveTab("root", 3);
      setActiveTab("root.1.1", 1);

      const submissionId = isRun
        ? await createRunSubmission({ problemSetupId, code })
        : await createGradeSubmission({ problemSetupId, code });

      setActiveSubmissionId(submissionId);
      toast.success(isRun ? "Run started" : "Submission created");

      // Fire-and-forget: the panel is already polling this submission, this
      // just shaves the latency down to (roughly) the push arriving instead
      // of waiting for the next 10s poll tick.
      void waitForTerminalSubmission(queryClient, submissionId).then(
        (status) => {
          queryClient.setQueryData(
            submissionStatusQueryKey(submissionId),
            status
          );
        }
      );
    } catch (error) {
      const fallbackMessage = isRun
        ? "Failed to run solution"
        : "Failed to submit solution";
      const message = error instanceof Error ? error.message : fallbackMessage;
      toast.error(message);
    } finally {
      setSubmittingSubmission(false);
    }
  };

  return {
    runCode: () => void submit(true),
    submitCode: () => void submit(false),
  };
}
