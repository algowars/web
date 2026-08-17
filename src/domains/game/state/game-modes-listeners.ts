import { gameApi } from "../api/game-api";
import { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";
import { GameModesActions } from "./game-modes-actions";

export const registerGameModesListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: GameModesActions.availableModesRequested,
    effect: async (_, listenerApi) => {
      try {
        const gameModes = await listenerApi
          .dispatch(gameApi.endpoints.gameModes.initiate())
          .unwrap();

        listenerApi.dispatch(GameModesActions.availableModesSuccess(gameModes));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load game modes";

        listenerApi.dispatch(
          GameModesActions.availableModesFailure({ message })
        );
      }
    },
  });
};
