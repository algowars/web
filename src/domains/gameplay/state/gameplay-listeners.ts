import type { TypedStartListening } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/shared/state/store";
import { gameplayApi } from "../api/gameplay-api";
import { GameModeEvents } from "./game-mode-events";

export const registerGameplayListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: GameModeEvents.loadGameModesRequested,
    effect: async (_action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        const response = await listenerApi
          .dispatch(gameplayApi.endpoints.getGameModes.initiate())
          .unwrap();

        listenerApi.dispatch(
          GameModeEvents.loadGameModesSuccess({ modes: response.modes })
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load game modes";

        listenerApi.dispatch(GameModeEvents.loadGameModesFailure({ message }));
      }
    },
  });
};
