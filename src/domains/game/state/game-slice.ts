import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/state/store";
import { GameActions } from "./game-actions";
import { GameStatus, type Game, type GameProblemHistory } from "../models/game";

interface GameState {
  isCreating: boolean;
  createdGameId: string | null;
  error: string | null;
  currentGame: Game | null;
  isLoading: boolean;
  countdownSeconds: number | null;
  gameTimeRemainingSeconds: number | null;
  problemHistory: GameProblemHistory[];
  isLoadingProblemHistory: boolean;
  problemHistoryError: string | null;
}

const initialState: GameState = {
  isCreating: false,
  createdGameId: null,
  error: null,
  currentGame: null,
  isLoading: false,
  countdownSeconds: null,
  gameTimeRemainingSeconds: null,
  problemHistory: [],
  isLoadingProblemHistory: false,
  problemHistoryError: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GameActions.createGameRequested, (state) => {
        state.isCreating = true;
        state.createdGameId = null;
        state.error = null;
      })
      .addCase(GameActions.createGameSuccess, (state, action) => {
        state.isCreating = false;
        state.createdGameId = action.payload;
      })
      .addCase(GameActions.createGameFailure, (state, action) => {
        state.isCreating = false;
        state.error = action.payload.message;
      })
      .addCase(GameActions.loadGameRequested, (state) => {
        state.isLoading = true;
        state.error = null;
        state.countdownSeconds = null;
        state.gameTimeRemainingSeconds = null;
      })
      .addCase(GameActions.loadGameSuccess, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
      })
      .addCase(GameActions.loadGameFailure, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(GameActions.gameCountdownStarted, (state, action) => {
        state.countdownSeconds = action.payload;
      })
      .addCase(GameActions.gameCountdownTicked, (state) => {
        if (state.countdownSeconds !== null) {
          state.countdownSeconds -= 1;
        }
      })
      .addCase(GameActions.gameTimerStarted, (state, action) => {
        state.gameTimeRemainingSeconds = action.payload;
      })
      .addCase(GameActions.gameTimerTicked, (state) => {
        if (state.gameTimeRemainingSeconds !== null) {
          state.gameTimeRemainingSeconds = Math.max(
            0,
            state.gameTimeRemainingSeconds - 1
          );
        }
      })
      .addCase(GameActions.startGameSuccess, (state, action) => {
        state.currentGame = action.payload;
        state.countdownSeconds = null;
        state.gameTimeRemainingSeconds = action.payload.timeLimitInSeconds;
        state.error = null;
      })
      .addCase(GameActions.startGameFailure, (state, action) => {
        state.countdownSeconds = null;
        state.error = action.payload.message;
      })
      .addCase(GameActions.forfeitGameRequested, (state) => {
        state.error = null;
        state.countdownSeconds = null;
        state.gameTimeRemainingSeconds = null;
      })
      .addCase(GameActions.forfeitGameSuccess, (state) => {
        state.error = null;
      })
      .addCase(GameActions.forfeitGameFailure, (state, action) => {
        state.error = action.payload.message;
      })
      .addCase(GameActions.loadProblemHistoryRequested, (state) => {
        state.isLoadingProblemHistory = true;
        state.problemHistoryError = null;
      })
      .addCase(GameActions.loadProblemHistorySuccess, (state, action) => {
        state.isLoadingProblemHistory = false;
        state.problemHistory = action.payload;
      })
      .addCase(GameActions.loadProblemHistoryFailure, (state, action) => {
        state.isLoadingProblemHistory = false;
        state.problemHistoryError = action.payload.message;
      });
  },
});

export default gameSlice.reducer;

export const selectIsCreatingGame = (state: RootState) => state.game.isCreating;
export const selectCreatedGameId = (state: RootState) =>
  state.game.createdGameId;
export const selectCurrentGame = (state: RootState) => state.game.currentGame;
export const selectIsGameOver = (state: RootState) => {
  const status = state.game.currentGame?.status;

  return (
    status === GameStatus.Completed ||
    String(status) === GameStatus[GameStatus.Completed] ||
    status === GameStatus.Cancelled ||
    String(status) === GameStatus[GameStatus.Cancelled]
  );
};
export const selectIsLoadingGame = (state: RootState) => state.game.isLoading;
export const selectGameCountdownSeconds = (state: RootState) =>
  state.game.countdownSeconds;
export const selectGameTimeRemainingSeconds = (state: RootState) =>
  state.game.gameTimeRemainingSeconds;
export const selectGameError = (state: RootState) => state.game.error;
export const selectGameProblemHistory = (state: RootState) =>
  state.game.problemHistory;
export const selectIsLoadingGameProblemHistory = (state: RootState) =>
  state.game.isLoadingProblemHistory;
export const selectGameProblemHistoryError = (state: RootState) =>
  state.game.problemHistoryError;
