import type { AppDispatch, RootState } from "@/shared/state/store";
import type { ForkedTaskAPI, TypedStartListening } from "@reduxjs/toolkit";
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
  const userId = listenerApi.getState().user.user?.id;
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

// Refresh cadence for the game loop: drives opponent-progress (currentProblem) updates in the
// progress panel and completion detection when no push arrives. Deliberately NOT what drives the
// visible timer — see startTimerTicker below.
const POLL_INTERVAL_MS = 3_000;

// Ticks the visible countdown every second, independent of the network poll cadence above. Pure
// local time math (no fetch), so it stays smooth regardless of how often the poll loop runs.
// Runs as a forked task and is cancelled automatically if the *listener itself* is cancelled
// (e.g. cancelActiveListeners() from another loadGameRequested/forfeitGameRequested dispatch).
// It is NOT auto-cancelled just because runGameLoop below returns normally — since it only knows
// wall-clock endTime and nothing about game status, callers must explicitly call
// ticker.cancel() once they've determined the game is actually over (see runGameLoop).
const startTimerTicker = (endTime: number, listenerApi: GameListenerApi) => {
  return listenerApi.fork(async (forkApi: ForkedTaskAPI) => {
    for (;;) {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      listenerApi.dispatch(GameActions.gameTimerStarted(remaining));

      if (remaining <= 0) {
        return;
      }

      await forkApi.delay(1000);
    }
  });
};

// Cadence used once local time is up but the server hasn't confirmed completion yet (small
// clock skew, or the completion push/message hasn't landed). Tighter than the normal poll
// interval since this should almost always resolve within one tick.
const GRACE_POLL_INTERVAL_MS = 1_000;

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

  const ticker = startTimerTicker(endTime, listenerApi);

  let pushAvailable = false;
  try {
    await joinGameUpdates(gameId);
    pushAvailable = true;
  } catch {
    // No push notifications for this game — the loop below still works fine on its regular
    // poll cadence. Not worth surfacing to the user; getGame polling still works fine.
  }

  try {
    // Keeps going past endTime (in the tighter grace cadence) until the server actually
    // confirms the game is over — a single check right at endTime isn't reliable, since the
    // server's own finalization (message consumer, sweep-job backstop, or push) can lag the
    // client's clock by a little.
    for (;;) {
      const beforeEndTime = Date.now() < endTime;
      const waitMs = beforeEndTime
        ? Math.max(0, Math.min(POLL_INTERVAL_MS, endTime - Date.now()))
        : GRACE_POLL_INTERVAL_MS;

      // Races the regular poll tick against a completion push, or a forfeit this same client
      // just performed, so either lets us react immediately instead of waiting out the rest of
      // this tick — it's an early-exit optimization on top of the normal cadence, not a
      // replacement for it.
      const pushed = await listenerApi.take(
        (action: unknown) =>
          (GameActions.gameCompletedPushReceived.match(action) &&
            action.payload.gameId === gameId) ||
          GameActions.forfeitGameSuccess.match(action),
        waitMs
      );

      game = await fetchGame(gameId, listenerApi);
      listenerApi.dispatch(GameActions.loadGameSuccess(game));

      if (
        isGameStatus(game, GameStatus.Completed) ||
        isGameStatus(game, GameStatus.Cancelled)
      ) {
        // Cancel the ticker explicitly rather than just force-dispatching 0 — the ticker has
        // no awareness of game status, only wall-clock endTime, so left running it would
        // simply overwrite this with its own (stale, nonzero) countdown on its next tick.
        ticker.cancel();
        listenerApi.dispatch(GameActions.gameTimerStarted(0));
        return;
      }

      // A push fired but the game wasn't actually done yet (e.g. it raced ahead of a very
      // slightly stale read) — loop back around immediately rather than waiting out the rest
      // of this tick again.
      if (pushed) {
        continue;
      }

      if (beforeEndTime) {
        const currentProblemId = getCurrentProblemId(game, listenerApi);
        if (currentProblemId && currentProblemId !== lastProblemId) {
          await loadCurrentProblem(game, listenerApi);
          lastProblemId = currentProblemId;
        }
      }
    }
  } finally {
    if (pushAvailable) {
      void leaveGameUpdates(gameId);
    }
  }
};
