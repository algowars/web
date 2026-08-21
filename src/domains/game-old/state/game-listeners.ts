import { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";
import { GameActions } from "./game-actions";
import { gameApi } from "../../game/api/game-api";
import { Game, GameStatus } from "../models/game";
import { toast } from "sonner";
import { problemApi } from "@/domains/problem/api/problem-api";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import { UserEvents } from "@/domains/user/state/user-events";
import { submissionApi } from "@/domains/submission/api/submission-api";
import { WorkspaceEvents } from "@/domains/workspace/state/workspace-events";
import {
  joinGameUpdates,
  leaveGameUpdates,
  onGameCompletedPush,
} from "@/shared/lib/signalr/game-hub-client";
import {
  connectSubmissionHub,
  onSubmissionCompletedPush,
} from "@/shared/lib/signalr/submission-hub-client";

type StartAppListening = TypedStartListening<RootState, AppDispatch>;
type AppListenerEffect = NonNullable<
  Parameters<StartAppListening>[0]["effect"]
>;
type AppListenerApi = Parameters<AppListenerEffect>[1];

/**
 * Loads the current user's active problem for the currently loaded game, if it isn't already
 * loaded. Reads game/user directly from state (rather than from whichever action triggered it)
 * so it can be safely called from more than one listener — the game and the user can each
 * become available first depending on timing (e.g. a hard refresh races the auth/user sync
 * chain against the game fetch), and either order needs to end up loading the problem.
 */
const loadCurrentProblemIfNeeded = async (listenerApi: AppListenerApi) => {
  const state = listenerApi.getState();
  const userId = state.user.user?.id;
  const game = state.game.currentGame;
  if (!userId || !game) return;

  const participant = game.participants.find((p) => p.userId === userId);
  const problemId = participant?.currentProblem?.problemId;
  if (!problemId) return;

  const problem = await listenerApi
    .dispatch(problemApi.endpoints.getProblemById.initiate(problemId))
    .unwrap();

  // Always dispatch initializeProblem even if the problem ID matches what was
  // previously loaded (e.g. game starts on the same problem the user was just
  // solving). Without this, codeVersionId is never cleared and the editor keeps
  // the old code and submission state instead of resetting for the game.
  listenerApi.dispatch(ProblemEvents.initializeProblem(problem));
};

const waitForTerminalSubmission = async (
  listenerApi: AppListenerApi,
  submissionId: string
) => {
  let unsubscribe = () => {};
  try {
    await connectSubmissionHub();
    const pushArrived = new Promise<void>((resolve) => {
      unsubscribe = onSubmissionCompletedPush(({ submissionId: id }) => {
        if (id === submissionId) resolve();
      });
    });
    await Promise.race([pushArrived, listenerApi.delay(60_000)]);
  } catch {
    // Hub unavailable — fall through and fetch anyway.
  } finally {
    unsubscribe();
  }

  return await listenerApi
    .dispatch(
      submissionApi.endpoints.getSubmissionStatus.initiate(submissionId, {
        subscribe: false,
        forceRefetch: true,
      })
    )
    .unwrap();
};

export const registerGameListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: GameActions.loadGameRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      // Navigating fresh to the game page: wipe any problem/workspace state
      // left over from a previously visited /problem/{slug} page so the game
      // workspace never shows a stale problem while the game is loading.
      const { currentGame } = listenerApi.getState().game;
      if (!currentGame) {
        listenerApi.dispatch(ProblemEvents.clearProblem());
        listenerApi.dispatch(WorkspaceEvents.workspaceReset());
      }

      try {
        const game = await listenerApi
          .dispatch(
            gameApi.endpoints.getGame.initiate(action.payload, {
              forceRefetch: true,
            })
          )
          .unwrap();

        listenerApi.dispatch(GameActions.loadGameSuccess(game));
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
    actionCreator: GameActions.loadGameSuccess,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      if (!isGameStatus(action.payload, GameStatus.Pending)) {
        return;
      }

      // Only start a Pending game once per page load (startRequestedForGameId is reset
      // whenever loadGameRequested fires again, e.g. on remount/manual refresh). This is what
      // stops loadGameSuccess -> startGameRequested -> startGameSuccess -> getGame ->
      // loadGameSuccess from looping forever if the game is still Pending after starting.
      const { startRequestedForGameId } = listenerApi.getState().game;
      if (startRequestedForGameId === action.payload.gameId) {
        return;
      }

      listenerApi.dispatch(
        GameActions.startGameRequested({ gameId: action.payload.gameId })
      );
    },
  });

  startAppListening({
    actionCreator: GameActions.loadGameSuccess,
    effect: async (_action, listenerApi) => {
      await loadCurrentProblemIfNeeded(listenerApi);
    },
  });

  // Subscribe to the SignalR "GameCompleted" push while the game is Running so the UI
  // updates immediately when the server finalizes the game (timer expiry, forfeit, etc.)
  // without waiting for the client-side countdown to fire a one-shot re-fetch that might
  // race the server's async finalization pipeline.
  startAppListening({
    actionCreator: GameActions.loadGameSuccess,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      if (!isGameStatus(action.payload, GameStatus.Running)) return;

      const gameId = action.payload.gameId;

      try {
        await joinGameUpdates(gameId);
      } catch {
        // SignalR unavailable — the countdown timer's onTimeExpired re-fetch is the fallback.
        return;
      }

      const unsubscribe = onGameCompletedPush((push) => {
        if (push.gameId === gameId) {
          listenerApi.dispatch(GameActions.loadGameRequested(gameId));
        }
      });

      // Hold this effect alive until the listener is cancelled (navigation, new loadGameSuccess,
      // etc.) so the subscription and cleanup stay active for the game's lifetime.
      try {
        await listenerApi.condition(() => false);
      } finally {
        unsubscribe();
        leaveGameUpdates(gameId);
      }
    },
  });

  // Covers the hard-refresh case: the game can finish loading before the auth/user sync chain
  // (userAuthenticated -> upsertUser -> initializeUser -> getAccount -> initializeUserSuccess)
  // does. Without this, the listener above bails on a missing userId and nothing ever retries
  // once the user does become available, leaving the problem stuck on "Loading problem...".
  startAppListening({
    actionCreator: UserEvents.initializeUserSuccess,
    effect: async (_action, listenerApi) => {
      await loadCurrentProblemIfNeeded(listenerApi);
    },
  });

  startAppListening({
    actionCreator: GameActions.createGameRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        const gameId = await listenerApi
          .dispatch(gameApi.endpoints.createGame.initiate(action.payload))
          .unwrap();

        listenerApi.dispatch(GameActions.createGameSuccess(gameId));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create game";
        listenerApi.dispatch(GameActions.createGameFailure({ message }));
        toast.error(message);
      }
    },
  });

  startAppListening({
    actionCreator: GameActions.createGameFailure,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();
      toast.error(action.payload.message, {});
    },
  });

  startAppListening({
    actionCreator: GameActions.startGameRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        await listenerApi
          .dispatch(gameApi.endpoints.startGame.initiate(action.payload.gameId))
          .unwrap();

        listenerApi.dispatch(
          GameActions.startGameSuccess({ gameId: action.payload.gameId })
        );
      } catch (error) {
        if (listenerApi.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to start game";
        listenerApi.dispatch(GameActions.startGameFailure({ message }));
      }
    },
  });

  startAppListening({
    actionCreator: GameActions.startGameSuccess,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        const game = await listenerApi
          .dispatch(
            gameApi.endpoints.getGame.initiate(action.payload.gameId, {
              forceRefetch: true,
            })
          )
          .unwrap();

        listenerApi.dispatch(GameActions.loadGameSuccess(game));
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
    actionCreator: GameActions.startGameFailure,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();
      toast.error(action.payload.message, {});
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
      } catch (error) {
        if (listenerApi.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to forfeit game";
        listenerApi.dispatch(GameActions.forfeitGameFailure({ message }));
      }
    },
  });

  startAppListening({
    actionCreator: GameActions.forfeitGameSuccess,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        const game = await listenerApi
          .dispatch(
            gameApi.endpoints.getGame.initiate(action.payload, {
              forceRefetch: true,
            })
          )
          .unwrap();
        listenerApi.dispatch(GameActions.loadGameSuccess(game));
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
    actionCreator: GameActions.forfeitGameFailure,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();
      toast.error(action.payload.message, {});
    },
  });

  startAppListening({
    actionCreator: GameActions.submitSoloRushSolutionRequested,
    effect: async (_action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      const state = listenerApi.getState();
      const game = state.game.currentGame;
      const problem = state.problemSetup.currentProblem;
      const problemSetupId = state.problemSetup.setup?.id;

      if (!game || !problem || !problemSetupId) {
        return;
      }

      listenerApi.dispatch(GameActions.soloRushSubmissionStarted());

      try {
        const submissionId = await listenerApi
          .dispatch(
            gameApi.endpoints.submitGameProblem.initiate({
              gameId: game.gameId,
              problemId: problem.id,
              body: {
                problemSetupId,
                code: state.workspace.code,
              },
            })
          )
          .unwrap();

        listenerApi.dispatch(
          GameActions.soloRushSubmissionCreated({ submissionId })
        );
        toast.success("Submission created");

        const submission = await waitForTerminalSubmission(
          listenerApi,
          submissionId
        );
        if (submission.status !== "Accepted") {
          return;
        }

        const completion = await listenerApi
          .dispatch(
            gameApi.endpoints.completeProblem.initiate({
              gameId: game.gameId,
              problemId: problem.id,
              body: { submissionId },
            })
          )
          .unwrap();

        listenerApi.dispatch(
          GameActions.completeProblemSuccess({
            gameId: game.gameId,
            userId: state.user.user?.id,
            newScore: completion.newScore,
            nextProblemId: completion.nextProblemId,
          })
        );

        if (!completion.nextProblemId) {
          listenerApi.dispatch(GameActions.loadGameRequested(game.gameId));
        }
      } catch (error) {
        if (listenerApi.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to submit solution";
        toast.error(message);
      } finally {
        listenerApi.dispatch(GameActions.soloRushSubmissionEnded());
      }
    },
  });

  startAppListening({
    actionCreator: GameActions.nextProblemRequested,
    effect: async (action, listenerApi) => {
      const nextProblemId = action.payload.nextProblemId;
      if (!nextProblemId) return;

      try {
        const nextProblem = await listenerApi
          .dispatch(
            problemApi.endpoints.getProblemById.initiate(nextProblemId, {
              forceRefetch: true,
            })
          )
          .unwrap();
        listenerApi.dispatch(ProblemEvents.initializeProblem(nextProblem));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load next problem";
        toast.error(message);
      }
    },
  });

  startAppListening({
    actionCreator: GameActions.loadProblemHistoryRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        const problemHistory = await listenerApi
          .dispatch(
            gameApi.endpoints.getGameProblemHistory.initiate(action.payload)
          )
          .unwrap();
        listenerApi.dispatch(
          GameActions.loadProblemHistorySuccess(problemHistory)
        );
      } catch (error) {
        if (listenerApi.signal.aborted) {
          return;
        }

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

  startAppListening({
    actionCreator: GameActions.loadProblemHistoryFailure,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();
      toast.error(action.payload.message, {});
    },
  });
};
const isGameStatus = (game: Game, status: GameStatus) => game.status === status;
