import type { AppDispatch, RootState } from "@/shared/state/store";
import type { TypedStartListening } from "@reduxjs/toolkit";
import { gameApi } from "../api/game-api";
import { GameStatus, type Game } from "../models/game";
import { GameActions } from "./game-actions";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import { problemApi } from "@/domains/problem/api/problem-api";
import { ProblemSetupEvents } from "@/domains/problem/state/problem-setup-slice";
import { toast } from "sonner";
import {
  joinGameUpdates,
  leaveGameUpdates,
} from "@/shared/lib/signalr/game-hub-client";

type GameListenerApi = Parameters<
  Parameters<TypedStartListening<RootState, AppDispatch>>[0]["effect"]
>[1];

export const registerGameListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: GameActions.loadGameRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        const game = await fetchGame(action.payload, listenerApi);

        listenerApi.dispatch(GameActions.loadGameSuccess(game));
        await loadCurrentProblem(game, listenerApi);

        const isPendingGame = isGameStatus(game, GameStatus.Pending);
        const isRunningGame = isGameStatus(game, GameStatus.Running);

        if (!isPendingGame && !isRunningGame) {
          return;
        }

        if (isPendingGame) {
          for (let remaining = 5; remaining > 0; remaining -= 1) {
            listenerApi.dispatch(GameActions.gameCountdownStarted(remaining));
            await listenerApi.delay(1000);
          }

          const startedGame = await listenerApi
            .dispatch(gameApi.endpoints.startGame.initiate(action.payload))
            .unwrap();

          const refreshedGame =
            startedGame ?? (await fetchGame(action.payload, listenerApi));

          listenerApi.dispatch(GameActions.startGameSuccess(refreshedGame));
          await loadCurrentProblem(refreshedGame, listenerApi);

          await runGameLoop(refreshedGame, action.payload, listenerApi);
          return;
        }

        await runGameLoop(game, action.payload, listenerApi);
      } catch (error) {
        if (listenerApi.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to load game";
        listenerApi.dispatch(GameActions.loadGameFailure({ message }));
      }
    },
  });

  startAppListening({
    actionCreator: GameActions.forfeitGameRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        await listenerApi
          .dispatch(gameApi.endpoints.forfeitGame.initiate(action.payload))
          .unwrap();

        listenerApi.dispatch(GameActions.forfeitGameSuccess(action.payload));
        const game = await fetchGame(action.payload, listenerApi);
        listenerApi.dispatch(GameActions.loadGameSuccess(game));
      } catch (error) {
        if (listenerApi.signal.aborted) {
          return;
        }

        try {
          const game = await fetchGame(action.payload, listenerApi);
          if (
            isGameStatus(game, GameStatus.Completed) ||
            isGameStatus(game, GameStatus.Cancelled)
          ) {
            listenerApi.dispatch(GameActions.loadGameSuccess(game));
            return;
          }
        } catch {
          // The original forfeit error is more useful to show to the user.
        }

        const message =
          error instanceof Error ? error.message : "Failed to forfeit game";
        toast.error("Unable to forfeit game", { description: message });
      }
    },
  });

  startAppListening({
    actionCreator: GameActions.loadProblemHistoryRequested,
    effect: async (action, listenerApi) => {
      try {
        const history = await listenerApi
          .dispatch(
            gameApi.endpoints.getGameProblemHistory.initiate(action.payload, {
              forceRefetch: true,
            })
          )
          .unwrap();

        listenerApi.dispatch(GameActions.loadProblemHistorySuccess(history));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load problem history";
        listenerApi.dispatch(
          GameActions.loadProblemHistoryFailure({ message })
        );
      }
    },
  });
};

const fetchGame = async (
  gameId: string,
  listenerApi: GameListenerApi
): Promise<Game> => {
  return listenerApi
    .dispatch(
      gameApi.endpoints.getGame.initiate(gameId, { forceRefetch: true })
    )
    .unwrap();
};

const isGameStatus = (game: Game, status: GameStatus) =>
  game.status === status || String(game.status) === GameStatus[status];

const getCurrentProblemId = (game: Game, listenerApi: GameListenerApi) => {
  const userId = listenerApi.getState().user.authProfile?.sub;
  const participant = userId
    ? game.participants.find((candidate) => candidate.userId === userId)
    : game.participants[0];

  return participant?.currentProblem?.problemId ?? null;
};

const loadCurrentProblem = async (game: Game, listenerApi: GameListenerApi) => {
  const problemId = getCurrentProblemId(game, listenerApi);
  if (!problemId) {
    return;
  }

  const problem = await listenerApi
    .dispatch(problemApi.endpoints.getProblemById.initiate(problemId))
    .unwrap();

  listenerApi.dispatch(ProblemEvents.initializeProblem(problem));

  const setup = problem.setups?.[0];
  if (setup) {
    listenerApi.dispatch(
      ProblemSetupEvents.loadProblemSetupSuccess({
        setup,
        languageVersionId: setup.id,
      })
    );
  }
};

// How long to wait for a SignalR completion push before falling back to a poll, when the hub
// connection is available. Generous, since the push is expected to arrive within milliseconds of
// the game actually ending — this interval only gets used if a push is missed (dropped
// connection, reconnect race, etc.), so it's a safety net rather than the primary signal.
const FALLBACK_POLL_INTERVAL_WITH_PUSH_MS = 20_000;

// Original tight-poll cadence, kept as the sole mechanism when the hub couldn't be joined (e.g.
// the client is offline, or SignalR itself is unreachable) so the game screen still behaves
// exactly as it did before this was added.
const FALLBACK_POLL_INTERVAL_WITHOUT_PUSH_MS = 3_000;

const runGameLoop = async (
  initialGame: Game,
  gameId: string,
  listenerApi: GameListenerApi
) => {
  let game = initialGame;
  let lastProblemId = getCurrentProblemId(game, listenerApi);
  const startedAt = game.startedAt
    ? new Date(game.startedAt).getTime()
    : Date.now();
  const endTime = startedAt + game.timeLimitInSeconds * 1000;

  let pushAvailable = false;
  try {
    await joinGameUpdates(gameId);
    pushAvailable = true;
  } catch {
    // No push notifications for this game — the loop below just falls back to its original
    // tight-poll behavior. Not worth surfacing to the user; getGame polling still works fine.
  }

  const pollIntervalMs = pushAvailable
    ? FALLBACK_POLL_INTERVAL_WITH_PUSH_MS
    : FALLBACK_POLL_INTERVAL_WITHOUT_PUSH_MS;

  try {
    while (Date.now() < endTime) {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      listenerApi.dispatch(GameActions.gameTimerStarted(remaining));

      const waitMs = Math.max(
        0,
        Math.min(pollIntervalMs, endTime - Date.now())
      );

      const pushed = await listenerApi.take(
        (action) =>
          GameActions.gameCompletedPushReceived.match(action) &&
          action.payload.gameId === gameId,
        waitMs
      );

      game = await fetchGame(gameId, listenerApi);
      listenerApi.dispatch(GameActions.loadGameSuccess(game));

      if (
        isGameStatus(game, GameStatus.Completed) ||
        isGameStatus(game, GameStatus.Cancelled)
      ) {
        return;
      }

      // A push fired but the game wasn't actually done yet (e.g. it raced ahead of a very
      // slightly stale read) — loop back around immediately rather than waiting out the rest
      // of the poll interval again.
      if (pushed) {
        continue;
      }

      const currentProblemId = getCurrentProblemId(game, listenerApi);
      if (currentProblemId && currentProblemId !== lastProblemId) {
        await loadCurrentProblem(game, listenerApi);
        lastProblemId = currentProblemId;
      }
    }

    const finalGame = await fetchGame(gameId, listenerApi);
    listenerApi.dispatch(GameActions.loadGameSuccess(finalGame));
  } finally {
    if (pushAvailable) {
      void leaveGameUpdates(gameId);
    }
  }
};
