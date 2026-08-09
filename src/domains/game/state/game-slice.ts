import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/state/store";
import { GameActions } from "./game-actions";
import type { Game } from "../models/game";

interface GameState {
  isCreating: boolean;
  createdGameId: string | null;
  error: string | null;
  currentGame: Game | null;
  isLoading: boolean;
  countdownSeconds: number | null;
}

const initialState: GameState = {
  isCreating: false,
  createdGameId: null,
  error: null,
  currentGame: null,
  isLoading: false,
  countdownSeconds: null,
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
      .addCase(GameActions.startGameSuccess, (state, action) => {
        state.currentGame = action.payload;
        state.countdownSeconds = null;
        state.error = null;
      })
      .addCase(GameActions.startGameFailure, (state, action) => {
        state.countdownSeconds = null;
        state.error = action.payload.message;
      });
  },
});

export default gameSlice.reducer;

export const selectIsCreatingGame = (state: RootState) => state.game.isCreating;
export const selectCreatedGameId = (state: RootState) =>
  state.game.createdGameId;
export const selectCurrentGame = (state: RootState) => state.game.currentGame;
export const selectIsLoadingGame = (state: RootState) => state.game.isLoading;
export const selectGameCountdownSeconds = (state: RootState) =>
  state.game.countdownSeconds;
export const selectGameError = (state: RootState) => state.game.error;
