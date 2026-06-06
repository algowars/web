"use client";

import { useEffect } from "react";

import { EditorWindowTab } from "../editor-window/editor-tab";
import {
  EditorWindowTabNode,
  useEditorWindowStore,
} from "../editor-window/state/editor-window-store";

type WorkspaceProps = {
  tab: EditorWindowTabNode;
};

export default function Workspace({ tab }: WorkspaceProps) {
  const createTabs = useEditorWindowStore((state) => state.createTabs);

  useEffect(() => {
    createTabs(tab);
  }, [tab, createTabs]);

  return <EditorWindowTab tab={tab} />;
}
