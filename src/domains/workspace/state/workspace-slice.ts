import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/state/store";
import { ProblemSetupEvents } from "@/domains/problem/state/problem-setup-slice";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import { WorkspaceEvents } from "./workspace-events";

interface WorkspaceState {
  selectedVersionId: string | null;
  code: string;
  /** The languageVersionId that `code` was loaded for. Cleared whenever a new
   *  problem is initialized so the next setup load resets the editor. Used to
   *  distinguish "same problem, same language, setup reloaded again" (keep code)
   *  from "new problem" (reset code) or "language switched" (reset code). */
  codeVersionId: string | null;
  isSubmittingSubmission: boolean;
  activeSubmissionId: string | null;
  activeTabByNode: Record<string, number>;
}

const initialState: WorkspaceState = {
  selectedVersionId: null,
  code: "",
  codeVersionId: null,
  isSubmittingSubmission: false,
  activeSubmissionId: null,
  activeTabByNode: {},
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(WorkspaceEvents.selectedVersionChanged, (state, action) => {
        state.selectedVersionId = action.payload;
      })
      .addCase(WorkspaceEvents.codeChanged, (state, action) => {
        state.code = action.payload;
      })
      .addCase(WorkspaceEvents.runCodeRequested, (state) => {
        // isSubmittingSubmission flips here, synchronously, in the same
        // update as clearing activeSubmissionId — not later inside the
        // async listener effect. That keeps the two flags the panel reads
        // to decide what to render from ever being out of sync for a
        // render, which is what caused the previous-status flash.
        state.activeSubmissionId = null;
        state.isSubmittingSubmission = true;
      })
      .addCase(WorkspaceEvents.submitCodeRequested, (state) => {
        state.activeSubmissionId = null;
        state.isSubmittingSubmission = true;
      })
      .addCase(
        WorkspaceEvents.submissionRequestStateChanged,
        (state, action) => {
          state.isSubmittingSubmission = action.payload;
        }
      )
      .addCase(WorkspaceEvents.activeSubmissionChanged, (state, action) => {
        state.activeSubmissionId = action.payload;
      })
      .addCase(ProblemEvents.initializeProblem, (state) => {
        // A new problem is loading — clear the version marker so the upcoming
        // loadProblemSetupSuccess will reset the editor code and submission state.
        state.codeVersionId = null;
        state.activeSubmissionId = null;
      })
      .addCase(ProblemSetupEvents.loadProblemSetupSuccess, (state, action) => {
        const { setup, languageVersionId } = action.payload;
        if (languageVersionId !== state.codeVersionId) {
          // New problem (codeVersionId was cleared by initializeProblem) or the
          // user switched language — reset the editor to the initial template.
          state.code = setup.initialCode ?? "";
          state.codeVersionId = languageVersionId;
        }
        // Same problem + same language version reloading (e.g. LanguageSelect
        // auto-selecting the default on mount): do nothing — keep the user's code
        // and any active submission state exactly as they were.
      })
      .addCase(WorkspaceEvents.editorTabActivated, (state, action) => {
        state.activeTabByNode[action.payload.nodeId] = action.payload.tabIndex;
      })
      .addCase(WorkspaceEvents.workspaceReset, () => initialState);
  },
});

export const workspaceReducer = workspaceSlice.reducer;

export const selectSelectedVersionId = (s: RootState) =>
  s.workspace.selectedVersionId;

export const selectWorkspaceCode = (s: RootState) => s.workspace.code;

export const selectIsSubmittingSubmission = (s: RootState) =>
  s.workspace.isSubmittingSubmission;

export const selectActiveSubmissionId = (s: RootState) =>
  s.workspace.activeSubmissionId;

export const selectActiveTabByNode = (s: RootState) =>
  s.workspace.activeTabByNode;

export const selectActiveTabIndex =
  (nodeId: string) =>
  (s: RootState): number =>
    s.workspace.activeTabByNode[nodeId] ?? 0;
