import { createAction } from "@reduxjs/toolkit";
import { CreateGameRequest } from "../api/game-api";
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

  startGameRequested: createAction<{ gameId: string }>(
    "game/startGameRequested"
  ),
  startGameSuccess: createAction<{ gameId: string }>("game/startGameSuccess"),
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
