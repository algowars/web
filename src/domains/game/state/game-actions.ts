import { createAction } from "@reduxjs/toolkit";
import type { CreateGameRequest } from "../api/game-api";
import type { Game, GameProblemHistory } from "../models/game";

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
  gameTimerStarted: createAction<number>("game/gameTimerStarted"),
  gameTimerTicked: createAction("game/gameTimerTicked"),
  startGameSuccess: createAction<Game>("game/startGameSuccess"),
  startGameFailure: createAction<{ message: string }>("game/startGameFailure"),
  forfeitGameRequested: createAction<string>("game/forfeitGameRequested"),
  forfeitGameSuccess: createAction<string>("game/forfeitGameSuccess"),
  forfeitGameFailure: createAction<{ message: string }>(
    "game/forfeitGameFailure"
  ),
  loadProblemHistoryRequested: createAction<string>(
    "game/loadProblemHistoryRequested"
  ),
  loadProblemHistorySuccess: createAction<GameProblemHistory[]>(
    "game/loadProblemHistorySuccess"
  ),
  loadProblemHistoryFailure: createAction<{ message: string }>(
    "game/loadProblemHistoryFailure"
  ),
};
