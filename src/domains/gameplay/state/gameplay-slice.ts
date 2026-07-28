import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  GameDto,
  GameModeDto,
  LobbyDto,
  SubmissionDto,
} from "../models/gameplay";
import { GameModeEvents } from "./game-mode-events";

interface GameplayState {
  gameModes: GameModeDto[];
  isLoadingModes: boolean;
  modesError: string | null;
  selectedModeId: string | null;
  currentLobby: LobbyDto | null;
  currentGame: GameDto | null;
  activeSubmission: SubmissionDto | null;
  isSubmitting: boolean;
  error: string | null;
  lastUpdatedAt: string | null;
}

const initialState: GameplayState = {
  gameModes: [],
  isLoadingModes: false,
  modesError: null,
  selectedModeId: null,
  currentLobby: null,
  currentGame: null,
  activeSubmission: null,
  isSubmitting: false,
  error: null,
  lastUpdatedAt: null,
};

const gameplaySlice = createSlice({
  name: "gameplay",
  initialState,
  reducers: {
    selectMode: (state, action: PayloadAction<string | null>) => {
      state.selectedModeId = action.payload;
      state.error = null;
    },
    lobbyCreated: (state, action: PayloadAction<LobbyDto>) => {
      state.currentLobby = action.payload;
      state.error = null;
      state.lastUpdatedAt = new Date().toISOString();
    },
    lobbyUpdated: (state, action: PayloadAction<LobbyDto>) => {
      state.currentLobby = action.payload;
      state.lastUpdatedAt = new Date().toISOString();
      state.error = null;
    },
    gameStarted: (state, action: PayloadAction<GameDto>) => {
      state.currentGame = action.payload;
      state.currentLobby = null;
      state.error = null;
      state.lastUpdatedAt = new Date().toISOString();
    },
    gameStateRefreshed: (state, action: PayloadAction<GameDto>) => {
      state.currentGame = action.payload;
      state.lastUpdatedAt = new Date().toISOString();
      state.error = null;
    },
    submissionQueued: (state, action: PayloadAction<SubmissionDto>) => {
      state.activeSubmission = action.payload;
      state.isSubmitting = true;
      state.error = null;
    },
    submissionUpdated: (state, action: PayloadAction<SubmissionDto>) => {
      state.activeSubmission = action.payload;
      state.isSubmitting =
        action.payload.status === "Queued" ||
        action.payload.status === "Running";
    },
    submissionCleared: (state) => {
      state.activeSubmission = null;
      state.isSubmitting = false;
    },
    gameplayError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isSubmitting = false;
    },
    resetGameplay: (state) => {
      state.selectedModeId = null;
      state.currentLobby = null;
      state.currentGame = null;
      state.activeSubmission = null;
      state.isSubmitting = false;
      state.error = null;
      state.lastUpdatedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GameModeEvents.loadGameModesRequested, (state) => {
        state.isLoadingModes = true;
        state.modesError = null;
      })
      .addCase(GameModeEvents.loadGameModesSuccess, (state, action) => {
        state.gameModes = action.payload.modes;
        state.isLoadingModes = false;
        state.modesError = null;
      })
      .addCase(GameModeEvents.loadGameModesFailure, (state, action) => {
        state.isLoadingModes = false;
        state.modesError = action.payload.message;
      });
  },
});

export const GameplayEvents = gameplaySlice.actions;
export const gameplayReducer = gameplaySlice.reducer;

export const selectGameModes = (state: { gameplay: GameplayState }) =>
  state.gameplay.gameModes;
export const selectIsLoadingGameModes = (state: {
  gameplay: GameplayState;
}) => state.gameplay.isLoadingModes;
export const selectGameModesError = (state: { gameplay: GameplayState }) =>
  state.gameplay.modesError;
export const selectSelectedModeId = (state: { gameplay: GameplayState }) =>
  state.gameplay.selectedModeId;
export const selectSelectedMode = createSelector(
  [selectGameModes, selectSelectedModeId],
  (modes, selectedModeId) =>
    modes.find((mode) => mode.id === selectedModeId) ?? null
);
export const selectCurrentLobby = (state: { gameplay: GameplayState }) =>
  state.gameplay.currentLobby;
export const selectCurrentGame = (state: { gameplay: GameplayState }) =>
  state.gameplay.currentGame;
export const selectActiveSubmission = (state: { gameplay: GameplayState }) =>
  state.gameplay.activeSubmission;
export const selectGameplayError = (state: { gameplay: GameplayState }) =>
  state.gameplay.error;
export const selectIsSubmittingGameplay = (state: {
  gameplay: GameplayState;
}) => state.gameplay.isSubmitting;
