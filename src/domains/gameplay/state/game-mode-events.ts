import { createAction } from "@reduxjs/toolkit";
import type { GameModeDto } from "../models/gameplay";

export const GameModeEvents = {
  loadGameModesRequested: createAction("gameMode/loadGameModesRequested"),
  loadGameModesSuccess: createAction<{ modes: GameModeDto[] }>(
    "gameMode/loadGameModesSuccess"
  ),
  loadGameModesFailure: createAction<{ message: string }>(
    "gameMode/loadGameModesFailure"
  ),
};
