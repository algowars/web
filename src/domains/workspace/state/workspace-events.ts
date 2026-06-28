import { createAction } from "@reduxjs/toolkit";

export const WorkspaceEvents = {
  selectedVersionChanged: createAction<string | null>(
    "workspace/selectedVersionChanged"
  ),
  editorTabActivated: createAction<{ nodeId: string; tabIndex: number }>(
    "workspace/editorTabActivated"
  ),
  workspaceReset: createAction("workspace/reset"),
};
