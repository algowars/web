import type { AppDispatch, RootState } from "@/shared/state/store";
import type { TypedStartListening } from "@reduxjs/toolkit";
import { gameApi } from "../api/game-api";
import { GameStatus } from "../models/game";
import { GameActions } from "./game-actions";

export const registerGameListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: GameActions.loadGameRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        const game = await listenerApi
          .dispatch(gameApi.endpoints.getGame.initiate(action.payload))
          .unwrap();

        listenerApi.dispatch(GameActions.loadGameSuccess(game));

        const isPendingGame =
          game.status === GameStatus.Pending ||
          String(game.status) === GameStatus[GameStatus.Pending];

        if (!isPendingGame) {
          return;
        }

        for (let remaining = 5; remaining > 0; remaining -= 1) {
          listenerApi.dispatch(GameActions.gameCountdownStarted(remaining));
          await listenerApi.delay(1000);
        }

        const startedGame = await listenerApi
          .dispatch(gameApi.endpoints.startGame.initiate(action.payload))
          .unwrap();

        listenerApi.dispatch(GameActions.startGameSuccess(startedGame));
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
};
