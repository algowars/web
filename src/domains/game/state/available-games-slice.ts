import { createSlice } from "@reduxjs/toolkit";
import { GameMode, GameModeType } from "../models/game-mode";
import { AvailableGamesActions } from "./available-games-actions";
import { RootState } from "@/shared/state/store";

interface AvailableGamesState {
  availableGames: GameMode[];
  isAvailableGamesLoading: boolean;
  availableGamesError: string | null;
}

const initialState: AvailableGamesState = {
  availableGames: [],
  isAvailableGamesLoading: false,
  availableGamesError: null,
};

const availableGamesSlice = createSlice({
  name: "availableGames",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(AvailableGamesActions.loadAvailableGamesRequested, (state) => {
        state.availableGames = [];
        state.isAvailableGamesLoading = true;
      })

      .addCase(
        AvailableGamesActions.loadAvailableGamesSuccess,
        (state, action) => {
          state.availableGames = action.payload;
          state.isAvailableGamesLoading = false;
        }
      )

      .addCase(
        AvailableGamesActions.loadAvailableGamesFailure,
        (state, action) => {
          state.availableGamesError = action.payload.message;
        }
      );
  },
});

export const availableGamesReducer = availableGamesSlice.reducer;

export const selectAvailableGames = (s: RootState) =>
  s.availableGames.availableGames;

export const selectAvailableGamesLoading = (s: RootState) =>
  s.availableGames.isAvailableGamesLoading;

export const selectAvailableGamesError = (s: RootState) =>
  s.availableGames.availableGamesError;

export const findAvailableGameByName = (type: GameModeType) => (s: RootState) =>
  s.availableGames.availableGames.find((g) => g.gameModeType === type);
