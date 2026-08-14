import { createSlice } from "@reduxjs/toolkit";
import { Game, GameProblemHistory } from "../models/game";
import { GameActions } from "./game-actions";

interface GameState {
  isCreating: boolean;
  creatingError: string | null;
  currentGame: Game | null;
  isGameLoading: boolean;
  gameError: string | null;
  isProblemHistoryLoading: boolean;
  problemHistory: GameProblemHistory[];
  problemHistoryError: string | null;
}

const initialState: GameState = {
  isCreating: false,
  creatingError: null,
  currentGame: null,
  isGameLoading: false,
  gameError: null,
  isProblemHistoryLoading: false,
  problemHistory: [],
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
        state.creatingError = null;
      })
      .addCase(GameActions.createGameSuccess, (state) => {
        state.isCreating = false;
      })
      .addCase(GameActions.createGameFailure, (state, action) => {
        state.isCreating = false;
        state.creatingError = action.payload.message;
      })
      .addCase(GameActions.loadGameRequested, (state) => {
        state.isGameLoading = true;
        state.gameError = null;
      })
      .addCase(GameActions.loadGameSuccess, (state, action) => {
        state.isGameLoading = false;
        state.currentGame = action.payload;
      })
      .addCase(GameActions.loadGameFailure, (state, action) => {
        state.isGameLoading = false;
        state.gameError = action.payload.message;
      })
      .addCase(GameActions.loadProblemHistoryRequested, (state) => {
        state.isProblemHistoryLoading = true;
        state.problemHistoryError = null;
      })
      .addCase(GameActions.loadProblemHistorySuccess, (state, action) => {
        state.isProblemHistoryLoading = false;
        state.problemHistory = action.payload;
      })
      .addCase(GameActions.loadProblemHistoryFailure, (state, action) => {
        state.isProblemHistoryLoading = false;
        state.problemHistoryError = action.payload.message;
      });
  },
});

export default gameSlice.reducer;
