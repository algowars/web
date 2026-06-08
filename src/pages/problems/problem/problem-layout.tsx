"use client";

import Workspace from "@/domains/workspace/components/workspace";
import type { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import SolutionEditor from "@/domains/workspace/solution-editor/components/solution-editor";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { CodeXml, FileText, Terminal } from "lucide-react";

export default function ProblemLayout() {
  const isMobile = useIsMobile();

  const problemTabs: EditorWindowTabNode = {
    key: "problem",
    name: "Problem",
    children: [
      {
        key: "description",
        name: "Description",
        icon: (
          <FileText
            size={16}
            className="text-blue-600 dark:text-blue-400"
          />
        ),
        component: <p>Hello world</p>,
      },
      {
        key: "examples",
        name: "Examples",
        icon: (
          <FileText
            size={16}
            className="text-sky-600 dark:text-sky-400"
          />
        ),
        component: <p>Example inputs and outputs go here.</p>,
      },
    ],
  };

  const executionTabs: EditorWindowTabNode = {
    key: "execution",
    name: "Execution",
    children: [
      {
        key: "console",
        name: "Console",
        icon: (
          <FileText
            size={16}
            className="text-purple-600 dark:text-purple-400"
          />
        ),
        component: <p>Run output will appear here.</p>,
      },
      {
        key: "tests",
        name: "Tests",
        icon: (
          <FileText
            size={16}
            className="text-indigo-600 dark:text-indigo-400"
          />
        ),
        component: <p>Test results will appear here.</p>,
      },
    ],
  };

  const desktopTabs: EditorWindowTabNode = {
    orientation: "horizontal",
    children: [
      {
        key: "code",
        name: "Code",
        defaultSize: 50,
        icon: (
          <CodeXml size={16} className="text-green-600 dark:text-green-400" />
        ),
        component: <SolutionEditor />,
      },
      {
        key: "right-column",
        defaultSize: 50,
        orientation: "vertical",
        children: [
          {
            ...problemTabs,
            defaultSize: 55,
          },
          {
            ...executionTabs,
            defaultSize: 45,
          },
        ],
      },
    ],
  };

  const mobileTabs: EditorWindowTabNode = {
    children: [
      {
        key: "code",
        name: "Code",
        icon: (
          <CodeXml size={16} className="text-green-600 dark:text-green-400" />
        ),
        component: <SolutionEditor />,
      },
      {
        ...problemTabs,
        icon: (
          <FileText size={16} className="text-blue-600 dark:text-blue-400" />
        ),
      },
      {
        ...executionTabs,
        icon: (
          <Terminal size={16} className="text-indigo-600 dark:text-indigo-400" />
        ),
      },
    ],
  };

  const tabs = isMobile ? mobileTabs : desktopTabs;

  return (
    <SidebarLayout breadcrumbs={[]}>
      <Workspace tab={tabs} />
    </SidebarLayout>
  );
}
