"use client";

import { Fragment, useState } from "react";
import { Card } from "../ui/card";
import { type Tab } from "./editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { EditorPanelHeader } from "./editor-panel-header";

type EditorTabProps = {
  tab: Tab;
};

export const EditorTab = ({ tab }: EditorTabProps) => {
  const [activeTab, setActiveTab] = useState(0);

  if (tab?.direction) {
    return (
      <ResizablePanelGroup direction={tab.direction}>
        {tab.children?.map((t, index) => (
          <Fragment key={t.key}>
            <ResizablePanel defaultSize={t.defaultSize} minSize={10}>
              <EditorTab tab={t} />
            </ResizablePanel>
            {tab.children && index !== tab?.children?.length - 1 ? (
              <ResizableHandle className="bg-inherit p-2 hover:bg-muted" />
            ) : null}
          </Fragment>
        ))}
      </ResizablePanelGroup>
    );
  }

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const currentTab = tab.children ? tab.children[activeTab] : tab;

  return (
    <Card className="h-full overflow-hidden bg-sidebar py-0 gap-0">
      <EditorPanelHeader
        tab={tab}
        currentTabIndex={activeTab}
        setCurrentTab={handleTabClick}
      />
      {currentTab?.component}
    </Card>
  );
};
