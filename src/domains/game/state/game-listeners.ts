import { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";
import { GameActions } from "./game-actions";
import { gameApi } from "../api/game-api";
import { Game, GameStatus } from "../models/game";
import { toast } from "sonner";

export const registerGameListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: GameActions.loadGameRequested,
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
    actionCreator: GameActions.loadGameSuccess,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        if (isGameStatus(action.payload, GameStatus.Pending)) {
          listenerApi.dispatch(
            GameActions.startGameRequested({ gameId: action.payload.gameId })
          );
          return;
        }
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
const isGameStatus = (game: Game, status: GameStatus) =>
  game.status === status || String(game.status) === GameStatus[status];
