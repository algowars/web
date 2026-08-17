import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/state/store";
import { GameMode, GameModeKey } from "../models/game-mode";
import { GameModesActions } from "./game-modes-actions";

interface GameModesState {
  gameModes: GameMode[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GameModesState = {
  gameModes: [],
  isLoading: false,
  error: null,
};

const gameModesSlice = createSlice({
  name: "gameModes",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(GameModesActions.availableModesRequested, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GameModesActions.availableModesSuccess, (state, action) => {
        state.isLoading = false;
        state.gameModes = action.payload;
      })
      .addCase(GameModesActions.availableModesFailure, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export default gameModesSlice.reducer;

export const selectGameModes = (s: RootState) => s.gameModes.gameModes;

export const selectGameModeByKey = (key: GameModeKey) => (s: RootState) =>
  s.gameModes.gameModes.find((gameMode) => gameMode.key === key);

export const selectGameModesError = (s: RootState) => s.gameModes.error;
