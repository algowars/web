import { createAction } from "@reduxjs/toolkit";
import type { CreateGameRequest } from "../api/game-api";
import type { Game } from "../models/game";

export const GameActions = {
  createGameRequested: createAction<CreateGameRequest>(
    "game/createGameRequested"
  ),
  createGameSuccess: createAction<string>("game/createGameSuccess"),
  createGameFailure: createAction<{ message: string }>(
    "game/createGameFailure"
  ),
  loadGameRequested: createAction<string>("game/loadGameRequested"),
  loadGameSuccess: createAction<Game>("game/loadGameSuccess"),
  loadGameFailure: createAction<{ message: string }>("game/loadGameFailure"),
  gameCountdownStarted: createAction<number>("game/gameCountdownStarted"),
  gameCountdownTicked: createAction("game/gameCountdownTicked"),
  startGameSuccess: createAction<Game>("game/startGameSuccess"),
  startGameFailure: createAction<{ message: string }>("game/startGameFailure"),
};
