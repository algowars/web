"use client";

import { useEffect } from "react";

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

  useEffect(() => {
    createTabs(tabs);
  }, [createTabs, tabs]);

  return <EditorWindowTab tab={tabs} />;
};
