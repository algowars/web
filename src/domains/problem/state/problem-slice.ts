import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { ProblemSummary } from "../models/problem-summary";
import { ProblemEvents } from "./problem-events";
import type { RootState } from "@/shared/state/store";

interface ProblemState {
  problems: ProblemSummary[];
  page: number;
  size: number;
  timestamp: string;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProblemState = {
  problems: [],
  page: 1,
  size: 20,
  timestamp: new Date().toISOString(),
  total: 0,
  isLoading: false,
  error: null,
};

const problemSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export const selectProblemsState = (s: RootState) => s.problems;
export const selectProblems = (s: RootState) => s.problems.problems;
export const selectProblemsPage = (s: RootState) => s.problems.page;
export const selectProblemsSize = (s: RootState) => s.problems.size;
export const selectProblemsTimestamp = (s: RootState) => s.problems.timestamp;
export const selectProblemsTotal = (s: RootState) => s.problems.total;
export const selectProblemsLoading = (s: RootState) => s.problems.isLoading;
export const selectProblemsError = (s: RootState) => s.problems.error;

export const selectProblemsStatus = createSelector(
  [selectProblemsLoading, selectProblemsError],
  (isLoading, error) => ({ isLoading, error })
);
