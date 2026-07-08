"use client";

import { EditorWindowTab } from "./editor-tab";
import { EditorWindowTabNode } from "./state/editor-window-store";

export type EditorWindowProps = {
  tabs: EditorWindowTabNode;
};

export const EditorWindow = ({ tabs }: EditorWindowProps) => {
  return <EditorWindowTab tab={tabs} />;
};
