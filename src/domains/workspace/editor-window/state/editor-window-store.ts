import { ReactNode } from "react";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type EditorWindowTabNode = {
  component?: ReactNode;
  headerComponent?: ReactNode;
  icon?: ReactNode;
  key?: string;
  children?: EditorWindowTabNode[];
  name?: string;
  orientation?: "horizontal" | "vertical";
  defaultSize?: number;
};

type EditorWindowState = {
  rootTab: EditorWindowTabNode | null;
  activeTabByNode: Record<string, number>;
};

type EditorWindowActions = {
  createTabs: (tabs: EditorWindowTabNode) => void;
  setActiveTab: (nodeId: string, tabIndex: number) => void;
};

type EditorWindowStore = EditorWindowState & EditorWindowActions;

export const useEditorWindowStore = create<EditorWindowStore>()(
  devtools((set) => ({
    rootTab: null,
    activeTabByNode: {},
    createTabs: (tabs) =>
      set((state) => {
        if (state.rootTab) {
          return state;
        }

        return {
          rootTab: tabs,
          activeTabByNode: {},
        };
      }),
    setActiveTab: (nodeId, tabIndex) =>
      set((state) => ({
        activeTabByNode: {
          ...state.activeTabByNode,
          [nodeId]: tabIndex,
        },
      })),
  }))
);
