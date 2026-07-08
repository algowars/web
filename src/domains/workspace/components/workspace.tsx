"use client";

import { EditorWindowTab } from "../editor-window/editor-tab";
import { EditorWindowTabNode } from "../editor-window/state/editor-window-store";

type WorkspaceProps = {
  readonly tab: EditorWindowTabNode;
};

export default function Workspace({ tab }: WorkspaceProps) {
  return <EditorWindowTab tab={tab} />;
}
