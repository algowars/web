import { createAction, createSlice } from "@reduxjs/toolkit";
import type { Problem } from "../models/problem";
import { ProblemEvents } from "./problem-events";
import type { RootState } from "@/shared/state/store";

export const ProblemSetupEvents = {
  loadProblemSetupRequested: createAction<{
    slug: string;
    languageVersionId: string;
  }>("problemSetup/loadRequested"),
  loadProblemSetupSuccess: createAction<{
    setup: unknown;
    languageVersionId: string;
  }>("problemSetup/loadSuccess"),
  loadProblemSetupFailure: createAction<{ message: string }>(
    "problemSetup/loadFailure"
  ),
};

interface ProblemSetupState {
  currentProblem: Problem | null;
  setup: unknown | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProblemSetupState = {
  currentProblem: null,
  setup: null,
  isLoading: false,
  error: null,
};

const problemSetupSlice = createSlice({
  name: "problemSetup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(ProblemEvents.initializeProblem, (state, action) => {
      state.currentProblem = action.payload;
      state.setup = null;
      state.isLoading = false;
      state.error = null;
    });

    builder.addCase(ProblemSetupEvents.loadProblemSetupRequested, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(
      ProblemSetupEvents.loadProblemSetupSuccess,
      (state, action) => {
        state.setup = action.payload.setup;
        state.isLoading = false;
        state.error = null;
      }
    );

    builder.addCase(
      ProblemSetupEvents.loadProblemSetupFailure,
      (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      }
    );
  },
});

export const problemSetupReducer = problemSetupSlice.reducer;

export const selectProblemSetupState = (s: RootState) => s.problemSetup;
export const selectCurrentProblem = (s: RootState) =>
  s.problemSetup.currentProblem;
export const selectProblemSetup = (s: RootState) => s.problemSetup.setup;
export const selectProblemSetupLoading = (s: RootState) =>
  s.problemSetup.isLoading;
export const selectProblemSetupError = (s: RootState) => s.problemSetup.error;
