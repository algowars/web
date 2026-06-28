import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { Problem } from "../models/problem";
import type { ProblemSummary } from "../models/problem-summary";
import { ProblemEvents } from "./problem-events";
import type { RootState } from "@/shared/state/store";

interface ProblemState {
  currentProblem: Problem | null;
  problems: ProblemSummary[];
  page: number;
  size: number;
  timestamp: string;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProblemState = {
  currentProblem: null,
  problems: [],
  page: 1,
  size: 20,
  timestamp: new Date().toISOString(),
  total: 0,
  isLoading: false,
  error: null,
};

const problemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ProblemEvents.initializeProblem, (state, action) => {
        state.currentProblem = action.payload;
      })
      .addCase(ProblemEvents.setProblemsPage, (state, action) => {
        state.page = action.payload;
      })
      .addCase(ProblemEvents.setProblemsSize, (state, action) => {
        state.size = action.payload;
      })
      .addCase(ProblemEvents.setProblemsTimestamp, (state, action) => {
        state.timestamp = action.payload;
      })
      .addCase(ProblemEvents.loadProblemsRequested, (state, action) => {
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.timestamp = action.payload.timestamp;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(ProblemEvents.loadProblemsSuccess, (state, action) => {
        state.problems = action.payload.results;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.timestamp = action.payload.timestamp;
        state.total = action.payload.total;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(ProblemEvents.loadProblemsFailure, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const problemReducer = problemSlice.reducer;

export const selectProblemState = (s: RootState) => s.problem;
export const selectCurrentProblem = (s: RootState) => s.problem.currentProblem;
export const selectProblems = (s: RootState) => s.problem.problems;
export const selectProblemsPage = (s: RootState) => s.problem.page;
export const selectProblemsSize = (s: RootState) => s.problem.size;
export const selectProblemsTimestamp = (s: RootState) => s.problem.timestamp;
export const selectProblemsTotal = (s: RootState) => s.problem.total;
export const selectProblemsLoading = (s: RootState) => s.problem.isLoading;
export const selectProblemsError = (s: RootState) => s.problem.error;

export const selectProblemsStatus = createSelector(
  [selectProblemsLoading, selectProblemsError],
  (isLoading, error) => ({ isLoading, error })
);
