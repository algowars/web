import { RootState } from "@/shared/state/store";
import { createSlice } from "@reduxjs/toolkit";
import { ProblemSubmission } from "../models/problem-submission";
import { ProblemSubmissionsEvents } from "./problem-submissions-events";

interface ProblemSubmissionsState {
  submissions: ProblemSubmission[];
  page: number;
  size: number;
  totalPages: number;
  timestamp: string;

  isProblemSubmissionsLoading: boolean;
  isLoadingMoreSubmissions: boolean;

  problemSubmissionsError: string | null;
}

const initialState: ProblemSubmissionsState = {
  submissions: [],
  page: 1,
  size: 10,
  totalPages: 0,
  isProblemSubmissionsLoading: false,
  isLoadingMoreSubmissions: false,
  problemSubmissionsError: null,
  timestamp: new Date().toISOString(),
};

const problemSubmissionsSlice = createSlice({
  name: "problemSubmissions",
  initialState: initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(ProblemSubmissionsEvents.loadSubmissionsRequested, (state) => {
        state.isProblemSubmissionsLoading = true;
      })

      .addCase(
        ProblemSubmissionsEvents.loadSubmissionsSuccess,
        (state, action) => {
          state.isProblemSubmissionsLoading = false;
          state.submissions = action.payload.results;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalPages = action.payload.total;
        }
      )

      .addCase(
        ProblemSubmissionsEvents.loadSubmissionsFailure,
        (state, action) => {
          state.isProblemSubmissionsLoading = false;
          state.problemSubmissionsError = action.payload.message;
        }
      )

      .addCase(
        ProblemSubmissionsEvents.loadMoreSubmissionsRequested,
        (state) => {
          state.isLoadingMoreSubmissions = true;
          state.problemSubmissionsError = null;
        }
      )

      .addCase(
        ProblemSubmissionsEvents.loadMoreSubmissionsSuccess,
        (state, action) => {
          state.isLoadingMoreSubmissions = false;
          state.submissions.push(...action.payload.results);
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalPages = action.payload.total;
        }
      )

      .addCase(
        ProblemSubmissionsEvents.loadMoreSubmissionsFailure,
        (state, action) => {
          state.isLoadingMoreSubmissions = false;
          state.problemSubmissionsError = action.payload.message;
        }
      );
  },
});

export const problemSubmissionsReducer = problemSubmissionsSlice.reducer;

export const selectHasMoreSubmissions = (s: RootState) =>
  s.problemSubmissions.page < s.problemSubmissions.totalPages;

export const selectProblemSubmissions = (s: RootState) =>
  s.problemSubmissions.submissions;

export const selectProblemSubmissionsError = (s: RootState) =>
  s.problemSubmissions.problemSubmissionsError;

export const selectProblemSubmissionsPage = (s: RootState) =>
  s.problemSubmissions.page;

export const selectProblemSubmissionsSize = (s: RootState) =>
  s.problemSubmissions.size;

export const selectProblemSubmissionsTimestamp = (s: RootState) =>
  s.problemSubmissions.timestamp;

export const selectProblemSubmissionsTotalPages = (s: RootState) =>
  s.problemSubmissions.totalPages;

export const selectProblemSubmissionsHasError = (s: RootState) =>
  !!s.problemSubmissions.problemSubmissionsError;

export const selectIsProblemSubmissionsLoading = (s: RootState) =>
  s.problemSubmissions.isProblemSubmissionsLoading;

export const selectIsLoadingMoreSubmissions = (s: RootState) =>
  s.problemSubmissions.isLoadingMoreSubmissions;
