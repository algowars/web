import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/state/store";
import { GameActions } from "./game-actions";

interface GameState {
  isCreating: boolean;
  createdGameId: string | null;
  error: string | null;
}

const initialState: GameState = {
  isCreating: false,
  createdGameId: null,
  error: null,
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
      });
  },
});

export default gameSlice.reducer;

export const selectIsCreatingGame = (state: RootState) => state.game.isCreating;
export const selectCreatedGameId = (state: RootState) =>
  state.game.createdGameId;
