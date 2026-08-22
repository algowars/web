"use client";

import { Fragment } from "react";

import { Card } from "@/shared/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/components/ui/resizable";
import { EditorWindowPanelHeader } from "./editor-panel-header";
import { EditorWindowTabNode } from "./state/editor-window-store";

type EditorWindowTabProps = {
  tab?: EditorWindowTabNode;
  nodeId?: string;
  /** Which child tab is active per node ID. Store-agnostic — callers own
   *  where this lives (redux, zustand, etc.) and pass it down. */
  activeTabByNode: Record<string, number>;
  /** Called with the node ID and the newly-clicked tab index. */
  onTabActivate: (nodeId: string, tabIndex: number) => void;
};

export const EditorWindowTab = ({
  tab,
  nodeId = "root",
  activeTabByNode,
  onTabActivate,
}: EditorWindowTabProps) => {
  const activeTab = activeTabByNode[nodeId] ?? 0;
  const resolvedTab = tab;

  if (!resolvedTab) {
    return null;
  }

  if (resolvedTab.orientation) {
    return (
      <ResizablePanelGroup orientation={resolvedTab.orientation}>
        {resolvedTab.children?.map((t, index) => (
          <Fragment key={t.key ?? `${nodeId}-${index}`}>
            <ResizablePanel defaultSize={t.defaultSize} minSize={10}>
              <EditorWindowTab
                tab={t}
                nodeId={`${nodeId}.${index}`}
                activeTabByNode={activeTabByNode}
                onTabActivate={onTabActivate}
              />
            </ResizablePanel>
            {resolvedTab.children &&
            index !== resolvedTab.children.length - 1 ? (
              <ResizableHandle className="bg-inherit p-1" />
            ) : null}
          </Fragment>
        ))}
      </ResizablePanelGroup>
    );
  }

  const handleTabClick = (index: number) => {
    onTabActivate(nodeId, index);
  };

  const currentTab = resolvedTab.children
    ? resolvedTab.children[Math.min(activeTab, resolvedTab.children.length - 1)]
    : resolvedTab;

  return (
    <Card className="h-full overflow-hidden bg-sidebar py-0 gap-0 flex flex-col">
      <EditorWindowPanelHeader
        tab={resolvedTab}
        currentTabIndex={activeTab}
        setCurrentTab={handleTabClick}
      />
      <div className="h-full overflow-y-auto">{currentTab?.component}</div>
    </Card>
  );
};
