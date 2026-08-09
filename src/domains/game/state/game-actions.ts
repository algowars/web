import { createAction } from "@reduxjs/toolkit";
import type { CreateGameRequest } from "../api/game-api";

export const GameActions = {
  createGameRequested: createAction<CreateGameRequest>(
    "game/createGameRequested"
  ),
  createGameSuccess: createAction<string>("game/createGameSuccess"),
  createGameFailure: createAction<{ message: string }>(
    "game/createGameFailure"
  ),
};
