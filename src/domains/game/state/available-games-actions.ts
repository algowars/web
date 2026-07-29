import { createAction } from "@reduxjs/toolkit";
import { GameMode } from "../models/game-mode";

export const AvailableGamesActions = {
  loadAvailableGamesRequested: createAction(
    "available-games/loadAvailableGamesRequested"
  ),
  loadAvailableGamesSuccess: createAction<GameMode[]>(
    "available-games/loadAvailableGamesSuccess"
  ),
  loadAvailableGamesFailure: createAction<{ message: string }>(
    "available-games/loadAvailableGamesFailure"
  ),
};
