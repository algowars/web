import { createAction } from "@reduxjs/toolkit";
import { CreateGameRequest } from "../../game/api/game-api";
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

  completeProblemSuccess: createAction<{
    gameId: string;
    userId: string | undefined;
    newScore: number;
    nextProblemId: string | null;
  }>("game/completeProblemSuccess"),

  submitSoloRushSolutionRequested: createAction(
    "game/submitSoloRushSolutionRequested"
  ),

  nextProblemRequested: createAction<{ nextProblemId: string }>(
    "game/nextProblemRequested"
  ),

  soloRushSubmissionStarted: createAction("game/soloRushSubmissionStarted"),
  soloRushSubmissionCreated: createAction<{ submissionId: string }>(
    "game/soloRushSubmissionCreated"
  ),
  soloRushSubmissionEnded: createAction("game/soloRushSubmissionEnded"),

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
