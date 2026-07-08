import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/state/store";
import { ProblemSetupEvents } from "@/domains/problem/state/problem-setup-slice";
import { WorkspaceEvents } from "./workspace-events";

interface WorkspaceState {
  selectedVersionId: string | null;
  code: string;
  activeTabByNode: Record<string, number>;
}

const initialState: WorkspaceState = {
  selectedVersionId: null,
  code: "",
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
      .addCase(ProblemSetupEvents.loadProblemSetupSuccess, (state, action) => {
        state.code = action.payload.setup.initialCode ?? "";
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

export const selectActiveTabByNode = (s: RootState) =>
  s.workspace.activeTabByNode;

export const selectActiveTabIndex =
  (nodeId: string) =>
  (s: RootState): number =>
    s.workspace.activeTabByNode[nodeId] ?? 0;
