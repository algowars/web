"use client";

import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { GameActions } from "../state/game-actions";
import {
  selectCurrentGame,
  selectGameProblemHistory,
  selectGameProblemHistoryError,
  selectIsLoadingGameProblemHistory,
} from "../state/game-slice";
import GameHistoryListItem from "./game-history-list-item";
import GameHistoryCurrentListItem from "./game-history-current-list-item";
import { useGetProblemByIdQuery } from "@/domains/problem/api/problem-api";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import { selectCurrentProblem } from "@/domains/problem/state/problem-setup-slice";

export default function GameHistoryPanel() {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectCurrentGame);
  const currentUserId = useAppSelector((state) => state.user.authProfile?.sub);
  const history = useAppSelector(selectGameProblemHistory);
  const historyError = useAppSelector(selectGameProblemHistoryError);
  const isLoadingHistory = useAppSelector(selectIsLoadingGameProblemHistory);

  // Same Problem (setups included) driving the live Code/Description tabs,
  // kept in sync by the game loop in game-listeners.ts. Reusing it here means
  // the "in progress" entry gets its setup the way /problems/{slug} does,
  // without a second fetch.
  const currentProblem = useAppSelector(selectCurrentProblem);

  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (game) {
      dispatch(GameActions.loadProblemHistoryRequested(game.gameId));
    }
  }, [dispatch, game?.gameId]);

  const solvedProblemIds = useMemo(() => {
    const ownHistory =
      history.find((player) => player.userId === currentUserId) ??
      (history.length === 1 ? history[0] : undefined);
    return ownHistory?.solvedProblemIds ?? [];
  }, [history, currentUserId]);

  const ownParticipant = useMemo(
    () =>
      game?.participants.find(
        (participant) => participant.userId === currentUserId
      ) ?? (game?.participants.length === 1 ? game.participants[0] : undefined),
    [game, currentUserId]
  );
  const currentProblemId = ownParticipant?.currentProblem?.problemId ?? null;

  useEffect(() => {
    if (!selectedProblemId) {
      const lastSolved = solvedProblemIds[solvedProblemIds.length - 1] ?? null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedProblemId(currentProblemId ?? lastSolved);
    }
  }, [selectedProblemId, currentProblemId, solvedProblemIds]);

  const isCurrentSelected =
    !!selectedProblemId && selectedProblemId === currentProblemId;

  const { data: fetchedProblem, isFetching: isLoadingSelectedProblem } =
    useGetProblemByIdQuery(selectedProblemId ?? "", {
      skip: !selectedProblemId || isCurrentSelected,
    });

  const selectedProblem = isCurrentSelected ? currentProblem : fetchedProblem;

  if (!game) {
    return null;
  }

  const hasAnyHistory = !!currentProblemId || solvedProblemIds.length > 0;

  return (
    <div className="flex h-full min-h-0">
      <div className="flex w-64 shrink-0 flex-col gap-2 overflow-y-auto border-r p-3">
        <div className="flex items-center gap-2 px-1">
          <History className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Previous problems</h2>
        </div>

        {isLoadingHistory && (
          <p className="px-1 text-xs text-muted-foreground">
            Loading history...
          </p>
        )}

        {historyError && (
          <p className="px-1 text-xs text-destructive">{historyError}</p>
        )}

        {!isLoadingHistory && !historyError && !hasAnyHistory && (
          <p className="px-1 text-xs text-muted-foreground">
            Nothing to show yet.
          </p>
        )}

        {currentProblemId && (
          <GameHistoryCurrentListItem
            problem={currentProblem}
            isSelected={selectedProblemId === currentProblemId}
            onSelect={setSelectedProblemId}
          />
        )}

        {solvedProblemIds.map((problemId, index) => (
          <GameHistoryListItem
            key={problemId}
            problemId={problemId}
            order={index + 1}
            isSelected={problemId === selectedProblemId}
            onSelect={setSelectedProblemId}
          />
        ))}
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto">
        {!selectedProblemId && (
          <div className="p-4 text-sm text-muted-foreground">
            Select a problem on the left to view it.
          </div>
        )}
        {selectedProblemId &&
          !isCurrentSelected &&
          isLoadingSelectedProblem &&
          !selectedProblem && (
            <div className="p-4 text-sm text-muted-foreground">
              Loading problem...
            </div>
          )}
        {selectedProblem && <ProblemQuestion problem={selectedProblem} />}
      </div>
    </div>
  );
}
