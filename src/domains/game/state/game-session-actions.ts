import { createAction } from "@reduxjs/toolkit";
import { GameModeType } from "../models/game-mode";

export const GameSessionActions = {
  gameSessionRequested: createAction<{
    gameModeType: GameModeType;
    gameModeName: string;
  }>("game-session/gameSessionRequested"),
  gameSessionCreated: createAction<{ id: string }>(
    "game-session/gameSessionCreated"
  ),
  gameSessionFailed: createAction<{ message: string }>(
    "game-session/gameSessionFailed"
  ),
  gameSessionCancelRequested: createAction(
    "game-session/gameSessionCancelRequested"
  ),
  gameSessionCancelled: createAction("game-session/gameSessionCancelled"),
};
