import { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";
import { GameActions } from "./game-actions";
import { gameApi } from "../api/game-api";
import { Game, GameStatus } from "../models/game";
import { get } from "https";

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
            if (
                isGameStatus(action.payload, GameStatus.
            )
        }
    },
  });
};

const isGameStatus = (game: Game, status: GameStatus) =>
  game.status === status || String(game.status) === GameStatus[status];