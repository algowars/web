"use client";

import { useEffect, useRef } from "react";

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
  const initialized = useRef(false);

  if (!initialized.current) {
    createTabs(tab);
    initialized.current = true;
  }

  useEffect(() => {
    if (initialized.current) {
      createTabs(tab);
    }
  }, [tab, createTabs]);

  return <EditorWindowTab tab={tab} />;
}
