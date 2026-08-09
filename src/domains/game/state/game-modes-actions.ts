import { createAction } from "@reduxjs/toolkit";
import { GameMode } from "../models/game-mode";

export const GameModesActions = {
  availableModesRequested: createAction("gameModes/availableModesRequested"),
  availableModesSuccess: createAction<GameMode[]>(
    "gameModes/availableModesSuccess"
  ),
  availableModesFailure: createAction<{ message: string }>(
    "gameModes/availableModesFailure"
  ),
};
