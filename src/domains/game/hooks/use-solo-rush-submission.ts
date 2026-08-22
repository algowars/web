"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSubmitGameProblem } from "../api/submit-game-problem";
import { useCompleteProblem } from "../api/complete-problem";
import { gameQueryOptions } from "../api/get-game";
import { gameProblemHistoryQueryOptions } from "../api/get-game-problem-history";
import { waitForTerminalSubmission } from "@/domains/submission/api/wait-for-terminal-submission";
import {
  useWorkspaceStore,
  selectWorkspaceCode,
  selectIsSubmittingSubmission,
} from "@/domains/workspace/state/workspace-store";
import { useGameSessionStore } from "../state/game-session-store";
import type { Game } from "../models/game";

type SubmitSoloRushSolutionArgs = {
  game: Game;
  problemId: string;
  problemSetupId: string;
};

/**
 * Orchestrates a Solo Rush submission: submit the current code -> wait for the
 * submission to reach a terminal state (SignalR push, 60s timeout fallback) ->
 * if accepted, complete the problem, flip the local "solved" flag so the
 * "Next Problem" button appears immediately, and invalidate the game query so
 * score/next-problem come from the server. Replaces the
 * `submitSoloRushSolutionRequested` listener effect.
 */
export function useSoloRushSubmission() {
  const queryClient = useQueryClient();
  const code = useWorkspaceStore(selectWorkspaceCode);
  const isSubmitting = useWorkspaceStore(selectIsSubmittingSubmission);
  const beginSubmission = useWorkspaceStore((s) => s.beginSubmission);
  const setSubmittingSubmission = useWorkspaceStore(
    (s) => s.setSubmittingSubmission
  );
  const setActiveSubmissionId = useWorkspaceStore(
    (s) => s.setActiveSubmissionId
  );
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const problemSolved = useGameSessionStore((s) => s.problemSolved);

  const { mutateAsync: submitGameProblem } = useSubmitGameProblem();
  const { mutateAsync: completeProblem } = useCompleteProblem();

  const submit = async ({
    game,
    problemId,
    problemSetupId,
  }: SubmitSoloRushSolutionArgs) => {
    beginSubmission();

    try {
      const submissionId = await submitGameProblem({
        gameId: game.gameId,
        problemId,
        body: { problemSetupId, code },
      });

      setActiveSubmissionId(submissionId);
      // Switch the workspace over to the Submission tab so the player sees
      // live status without having to find it themselves.
      setActiveTab("root", 3);
      setActiveTab("root.1.1", 1);
      toast.success("Submission created");

      const submission = await waitForTerminalSubmission(
        queryClient,
        submissionId
      );
      if (submission.status !== "Accepted") {
        return;
      }

      const completion = await completeProblem({
        gameId: game.gameId,
        problemId,
        body: { submissionId },
      });

      problemSolved(completion.nextProblemId);

      // Refetch rather than hand-patching the cache — the server is the
      // source of truth for score/next-problem/final status, and the game
      // query is cheap to re-fetch.
      void queryClient.invalidateQueries({
        queryKey: gameQueryOptions({ gameId: game.gameId }).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: gameProblemHistoryQueryOptions({ gameId: game.gameId })
          .queryKey,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit solution";
      toast.error(message);
    } finally {
      setSubmittingSubmission(false);
    }
  };

  return { submit, isSubmitting };
}
