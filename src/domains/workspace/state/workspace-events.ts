import { createAction } from "@reduxjs/toolkit";

export const WorkspaceEvents = {
  selectedVersionChanged: createAction<string | null>(
    "workspace/selectedVersionChanged"
  ),
  codeChanged: createAction<string>("workspace/codeChanged"),
  runCodeRequested: createAction("workspace/runCodeRequested"),
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
