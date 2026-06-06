"use client";

import { EditorWindowTab } from "./editor-tab";
import {
  EditorWindowTabNode,
  useEditorWindowStore,
} from "./state/editor-window-store";

export type EditorWindowProps = {
  tabs: EditorWindowTabNode;
};

export const EditorWindow = ({ tabs }: EditorWindowProps) => {
  const createTabs = useEditorWindowStore((state) => state.createTabs);

  createTabs(tabs);

  return <EditorWindowTab />;
};
