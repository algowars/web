"use client";

import { useEffect } from "react";
import { History, Trophy } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { GameActions } from "../state/game-actions";
import {
  selectCurrentGame,
  selectGameProblemHistory,
  selectGameProblemHistoryError,
  selectIsLoadingGameProblemHistory,
} from "../state/game-slice";

export default function GameProgressPanel() {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectCurrentGame);
  const history = useAppSelector(selectGameProblemHistory);
  const historyError = useAppSelector(selectGameProblemHistoryError);
  const isLoadingHistory = useAppSelector(selectIsLoadingGameProblemHistory);

  useEffect(() => {
    if (game) {
      dispatch(GameActions.loadProblemHistoryRequested(game.gameId));
    }
  }, [dispatch, game, game?.gameId]);

  if (!game) {
    return null;
  }

  let historyContent = (
    <p className="text-sm text-muted-foreground">No solved problems yet.</p>
  );

  if (isLoadingHistory) {
    historyContent = (
      <p className="text-sm text-muted-foreground">Loading history...</p>
    );
  } else if (historyError) {
    historyContent = <p className="text-sm text-destructive">{historyError}</p>;
  } else if (history.length) {
    historyContent = (
      <div className="space-y-3">
        {history.map((player) => (
          <div key={player.userId} className="rounded-md border p-3">
            <p className="mb-2 text-sm font-medium">
              {game.participants.find(
                (participant) => participant.userId === player.userId
              )?.username ?? player.userId}
            </p>
            <p className="text-xs text-muted-foreground">
              Solved {player.solvedProblemIds.length} problem
              {player.solvedProblemIds.length === 1 ? "" : "s"}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {player.solvedProblemIds.map((problemId) => (
                <li key={problemId} className="truncate font-mono">
                  {problemId}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Leaderboard</h2>
        </div>
        <div className="space-y-2">
          {game.participants
            .slice()
            .sort((first, second) => second.score - first.score)
            .map((participant, index) => (
              <div
                key={participant.userId}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {index + 1}. {participant.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Current problem:{" "}
                    {participant.currentProblem?.problemId ?? "Finished"}
                  </p>
                </div>
                <Badge variant={index === 0 ? "default" : "secondary"}>
                  {participant.score} pts
                </Badge>
              </div>
            ))}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <History className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Problem history</h2>
        </div>
        {historyContent}
      </section>
    </div>
  );
}
