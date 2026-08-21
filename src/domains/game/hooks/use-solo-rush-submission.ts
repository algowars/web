"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSubmitGameProblem } from "../api/submit-game-problem";
import { useCompleteProblem } from "../api/complete-problem";
import { gameQueryOptions } from "../api/get-game";
import { waitForTerminalSubmission } from "@/domains/submission/api/wait-for-terminal-submission";
import {
  useWorkspaceStore,
  selectWorkspaceCode,
  selectIsSubmittingSubmission,
} from "@/domains/workspace/state/workspace-store";
import { useUserStore, selectUser } from "@/domains/user/state/user-store";
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
 * if accepted, complete the problem and patch the game query cache with the
 * new score/next-problem so the UI updates without a round-trip refetch (the
 * game is still Running so there's nothing new to fetch until the player
 * moves on). Replaces the `submitSoloRushSolutionRequested` listener effect.
 */
export function useSoloRushSubmission() {
  const queryClient = useQueryClient();
  const user = useUserStore(selectUser);
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

      queryClient.setQueryData(
        gameQueryOptions({ gameId: game.gameId }).queryKey,
        (current: Game | undefined) => {
          if (!current || !user) return current;
          return {
            ...current,
            participants: current.participants.map((participant) =>
              participant.userId === user.id
                ? {
                    ...participant,
                    score: completion.newScore,
                    currentProblem: completion.nextProblemId
                      ? { problemId: completion.nextProblemId }
                      : null,
                  }
                : participant
            ),
          };
        }
      );

      problemSolved(completion.nextProblemId);

      if (!completion.nextProblemId) {
        // Last problem solved — refetch so the game's final (Completed)
        // status comes from the server rather than being inferred client-side.
        void queryClient.invalidateQueries({
          queryKey: gameQueryOptions({ gameId: game.gameId }).queryKey,
        });
      }
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
