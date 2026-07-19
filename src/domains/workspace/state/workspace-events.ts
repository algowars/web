import { createAction } from "@reduxjs/toolkit";

export const WorkspaceEvents = {
  selectedVersionChanged: createAction<string | null>(
    "workspace/selectedVersionChanged"
  ),
  codeChanged: createAction<string>("workspace/codeChanged"),
  submitCodeRequested: createAction("workspace/submitCodeRequested"),
  submissionRequestStateChanged: createAction<boolean>(
    "workspace/submissionRequestStateChanged"
  ),
  activeSubmissionChanged: createAction<string | null>(
    "workspace/activeSubmissionChanged"
  ),
  editorTabActivated: createAction<{ nodeId: string; tabIndex: number }>(
    "workspace/editorTabActivated"
  ),
  workspaceReset: createAction("workspace/reset"),
};
