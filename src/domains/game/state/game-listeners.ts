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
        const isRunningGame =
          game.status === GameStatus.Running ||
          String(game.status) === GameStatus[GameStatus.Running];

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

          listenerApi.dispatch(GameActions.startGameSuccess(startedGame));

          await runGameTimer(startedGame.timeLimitInSeconds, listenerApi);
          return;
        }

        const elapsedSeconds = game.startedAt
          ? Math.floor((Date.now() - new Date(game.startedAt).getTime()) / 1000)
          : 0;
        await runGameTimer(
          Math.max(0, game.timeLimitInSeconds - elapsedSeconds),
          listenerApi
        );
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

const runGameTimer = async (
  initialSeconds: number,
  listenerApi: Parameters<
    Parameters<TypedStartListening<RootState, AppDispatch>>[0]["effect"]
  >[1]
) => {
  for (let remaining = initialSeconds; remaining > 0; remaining -= 1) {
    listenerApi.dispatch(GameActions.gameTimerStarted(remaining));
    await listenerApi.delay(1000);
  }
};
