"use client";

import { Fragment } from "react";

import { Card } from "@/shared/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/components/ui/resizable";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { EditorWindowPanelHeader } from "./editor-panel-header";
import { WorkspaceEvents } from "../../state/workspace-events";
import { selectActiveTabIndex } from "../../state/slice";
import { EditorWindowTabNode } from "./state/editor-window-store";

type EditorWindowTabProps = {
  tab?: EditorWindowTabNode;
  nodeId?: string;
};

export const EditorWindowTab = ({
  tab,
  nodeId = "root",
}: EditorWindowTabProps) => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTabIndex(nodeId));
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
    dispatch(WorkspaceEvents.editorTabActivated({ nodeId, tabIndex: index }));
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
