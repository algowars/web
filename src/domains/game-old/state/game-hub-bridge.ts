import type { AppDispatch } from "@/shared/state/store";
import { onGameCompletedPush } from "@/shared/lib/signalr/game-hub-client";
import { GameActions } from "./game-actions";

let bridged = false;

/**
 * Wires the SignalR game hub into the redux store by dispatching a plain action whenever the
 * server pushes a game-completed event. Call once, right after the store is created (see
 * StoreProvider).
 *
 * This has to live outside the listener middleware: listener effects only get a dispatch handle
 * while they're actively running in response to some other action, but the hub can push a
 * completion event at any time, including while nothing else is happening. Bridging it into a
 * plain dispatched action lets any listener (see game-listeners.ts's runGameLoop) pick it up via
 * `listenerApi.take`, same as it would react to any other store action.
 */
export const registerGameHubBridge = (dispatch: AppDispatch) => {
  if (bridged) {
    return;
  }
  bridged = true;

  onGameCompletedPush((payload) => {
    dispatch(GameActions.gameCompletedPushReceived(payload));
  });
};
