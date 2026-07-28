"use client";

import { useEffect, useState } from "react";
import {
  useCreateGameSubmissionMutation,
  useGetGameStateQuery,
  useGetGameSubmissionStatusQuery,
} from "@/domains/gameplay/api/gameplay-api";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { GameplayEvents, selectCurrentGame } from "../state/gameplay-slice";
import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";

export default function GameplayGameScreen() {
  const dispatch = useAppDispatch();
  const currentGame = useAppSelector(selectCurrentGame);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const { data: refreshedGame, isFetching } = useGetGameStateQuery(
    currentGame?.id ?? "",
    {
      skip: !currentGame?.id,
      pollingInterval: 3000,
    }
  );

  const [createSubmission, { isLoading: isCreatingSubmission }] =
    useCreateGameSubmissionMutation();

  useEffect(() => {
    if (refreshedGame) {
      dispatch(GameplayEvents.gameStateRefreshed(refreshedGame));
    }
  }, [dispatch, refreshedGame]);

  const handleSubmit = async () => {
    if (!currentGame?.problems[0]?.problemId) {
      return;
    }

    try {
      const submission = await createSubmission({
        problemSetupId: currentGame.problems[0].problemId,
        type: "Standard",
        code: "function add(a, b) { return a + b; }",
        customTestCases: [],
      }).unwrap();

      setSubmissionId(submission.id);
      dispatch(GameplayEvents.submissionQueued(submission));
    } catch (error) {
      dispatch(
        GameplayEvents.gameplayError(
          error instanceof Error ? error.message : "Unable to submit solution"
        )
      );
    }
  };

  if (!currentGame) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentGame.status === "Completed" ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : (
              <Clock3 className="size-5" />
            )}
            Active game
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">Current problem</p>
              <p className="text-muted-foreground">
                {currentGame.problems[0]?.problemId ??
                  "No problem assigned yet"}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">Progress</p>
              <p className="text-muted-foreground">
                {currentGame.players.length} players ·{" "}
                {currentGame.problems.length} assigned problems
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isCreatingSubmission || !currentGame.problems.length}
            >
              {isCreatingSubmission
                ? "Submitting..."
                : "Submit sample solution"}
            </Button>
          </div>
          {submissionId ? (
            <SubmissionStatusCard submissionId={submissionId} />
          ) : null}
          {isFetching ? (
            <p className="text-sm text-muted-foreground">
              Refreshing game state…
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {currentGame.players.map((player) => (
            <div
              key={player.userId}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <span>{player.username}</span>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>Score {player.score}</span>
                <span>Step {player.currentRuleStepOrder ?? 0}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

type SubmissionStatusCardProps = {
  submissionId: string;
};

function SubmissionStatusCard({
  submissionId,
}: Readonly<SubmissionStatusCardProps>) {
  const dispatch = useAppDispatch();
  const { data, isFetching } = useGetGameSubmissionStatusQuery(submissionId, {
    pollingInterval: 1500,
    skip: !submissionId,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    dispatch(GameplayEvents.submissionUpdated(data));

    if (
      data.status === "Accepted" ||
      data.status === "WrongAnswer" ||
      data.status === "Error"
    ) {
      dispatch(
        GameplayEvents.gameplayError(
          data.status === "Error" ? "Submission failed" : "Submission complete"
        )
      );
    }
  }, [data, dispatch]);

  let icon = <Clock3 className="size-4" />;
  let statusText = data?.status ?? "Queued";

  if (data?.status === "Accepted") {
    icon = <CheckCircle2 className="size-4 text-green-600" />;
  } else if (data?.status === "WrongAnswer") {
    icon = <AlertCircle className="size-4 text-yellow-600" />;
  }

  return (
    <div className="rounded-lg border border-dashed p-3 text-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span>Submission: {statusText}</span>
      </div>
      {isFetching ? (
        <p className="mt-2 text-muted-foreground">Polling for status update…</p>
      ) : null}
    </div>
  );
}
