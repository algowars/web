"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGame, gameQueryOptions } from "../api/get-game";
import { useStartGame } from "../api/start-game";
import { problemByIdQueryOptions } from "@/domains/problem/api/get-problem-by-id";
import { useInitializeProblem, useClearProblem } from "@/domains/problem/hooks/use-problem-actions";
import { useWorkspaceStore } from "@/domains/workspace/state/workspace-store";
import { useUserStore, selectUser } from "@/domains/user/state/user-store";
import { Game, GameStatus } from "../models/game";
import {
  joinGameUpdates,
  leaveGameUpdates,
  onGameCompletedPush,
} from "@/shared/lib/signalr/game-hub-client";

const isGameStatus = (game: Game, status: GameStatus) => game.status === status;

/**
 * Loads and keeps a game session in sync: fetches the game, auto-starts it once
 * if it's Pending, subscribes to the SignalR "GameCompleted" push while Running
 * (falling back to the caller's timer-driven refetch if the hub is unavailable),
 * and loads the current user's active problem into the problem-setup store
 * whenever the game or the user identity becomes available. Replaces
 * `registerGameListeners`.
 */
export function useGameSession(gameId: string) {
  const queryClient = useQueryClient();
  const clearProblem = useClearProblem();
  const workspaceReset = useWorkspaceStore((s) => s.reset);
  const initializeProblem = useInitializeProblem();
  const user = useUserStore(selectUser);

  const gameQuery = useGame({ gameId });
  const { mutateAsync: startGame } = useStartGame();

  const startRequestedForGameId = useRef<string | null>(null);
  const previousGameId = useRef<string | null>(null);
  const lastLoadedProblemId = useRef<string | null>(null);

  // Navigating fresh to a game (or to a different game entirely): wipe any
  // problem/workspace state left over from a previous /problem/{slug} page or
  // a different game so the workspace never flashes stale content.
  useEffect(() => {
    if (previousGameId.current !== gameId) {
      previousGameId.current = gameId;
      startRequestedForGameId.current = null;
      lastLoadedProblemId.current = null;
      clearProblem();
      workspaceReset();
    }
  }, [gameId, clearProblem, workspaceReset]);

  const game = gameQuery.data;

  // Auto-start a Pending game, once per page load.
  useEffect(() => {
    if (!game || !isGameStatus(game, GameStatus.Pending)) return;
    if (startRequestedForGameId.current === game.gameId) return;

    startRequestedForGameId.current = game.gameId;

    void startGame({ gameId: game.gameId }, {
      onError: () => {
        startRequestedForGameId.current = null;
      },
    });
    // start-game's mutation invalidates the game query on success, which
    // triggers the refetch that used to be the explicit getGame dispatch.
  }, [game, startGame]);

  // Subscribe to the SignalR "GameCompleted" push while the game is Running so the
  // UI updates immediately when the server finalizes the game, without waiting for
  // the client-side countdown's one-shot re-fetch (which might race server finalization).
  useEffect(() => {
    if (!game || !isGameStatus(game, GameStatus.Running)) return;

    const runningGameId = game.gameId;
    let unsubscribe = () => {};
    let cancelled = false;

    void joinGameUpdates(runningGameId)
      .then(() => {
        if (cancelled) return;
        unsubscribe = onGameCompletedPush((push) => {
          if (push.gameId === runningGameId) {
            queryClient.invalidateQueries({
              queryKey: gameQueryOptions({ gameId: runningGameId }).queryKey,
            });
          }
        });
      })
      .catch(() => {
        // SignalR unavailable — the countdown timer's onTimeExpired re-fetch is the fallback.
      });

    return () => {
      cancelled = true;
      unsubscribe();
      void leaveGameUpdates(runningGameId);
    };
  }, [game, queryClient]);

  // Load the current user's active problem for this game, if it isn't already
  // loaded. Re-runs whenever the game or the user identity changes, which
  // covers both orderings of the hard-refresh race between auth/user sync and
  // the game fetch (whichever becomes available second triggers the load) —
  // and skips re-fetching when the problem ID hasn't actually changed (e.g. a
  // routine game poll), guarded by the lastLoadedProblemId ref above.
  useEffect(() => {
    if (!user || !game) return;

    const participant = game.participants.find((p) => p.userId === user.id);
    const problemId = participant?.currentProblem?.problemId;
    if (!problemId || problemId === lastLoadedProblemId.current) return;

    lastLoadedProblemId.current = problemId;

    void queryClient
      .fetchQuery(problemByIdQueryOptions({ id: problemId }))
      .then((problem) => {
        // Always re-initialize even if this races a newer fetch — the store
        // update is idempotent per problem ID, and initializeProblem also
        // resets the editor's codeVersionId so the workspace resets cleanly.
        initializeProblem(problem);
      })
      .catch(() => {
        lastLoadedProblemId.current = null;
      });
  }, [user, game, queryClient, initializeProblem]);

  return {
    game,
    isLoading: gameQuery.isLoading,
    error: gameQuery.error?.message ?? null,
    refetch: gameQuery.refetch,
  };
}
