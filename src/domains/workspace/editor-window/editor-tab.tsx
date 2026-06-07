"use client";

import { Fragment } from "react";

import { Card } from "@/shared/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/components/ui/resizable";
import { EditorWindowPanelHeader } from "./editor-panel-header";
import {
  EditorWindowTabNode,
  useEditorWindowStore,
} from "./state/editor-window-store";

type EditorWindowTabProps = {
  tab?: EditorWindowTabNode;
  nodeId?: string;
};

export const EditorWindowTab = ({
  tab,
  nodeId = "root",
}: EditorWindowTabProps) => {
  const rootTab = useEditorWindowStore((state) => state.rootTab);
  const activeTab = useEditorWindowStore(
    (state) => state.activeTabByNode[nodeId] ?? 0
  );
  const setActiveTab = useEditorWindowStore((state) => state.setActiveTab);
  const resolvedTab = tab ?? rootTab;

  if (!resolvedTab) {
    return null;
  }

  if (resolvedTab.orientation) {
    return (
      <ResizablePanelGroup orientation={resolvedTab.orientation}>
        {resolvedTab.children?.map((t, index) => (
          <Fragment key={t.key ?? `${nodeId}-${index}`}>
            <ResizablePanel defaultSize={t.defaultSize} minSize={10}>
              <EditorWindowTab tab={t} nodeId={`${nodeId}.${index}`} />
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
    setActiveTab(nodeId, index);
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
      <div className="flex-1 min-h-0 overflow-y-auto">
        {currentTab?.component}
      </div>
    </Card>
  );
};
