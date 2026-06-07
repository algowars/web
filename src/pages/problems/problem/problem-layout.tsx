import Workspace from "@/domains/workspace/components/workspace";
import type { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import SolutionEditor from "@/domains/workspace/solution-editor/components/solution-editor";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { CodeXml, FileText } from "lucide-react";

export default function ProblemLayout() {
  const tabs: EditorWindowTabNode = {
    direction: "horizontal",
    children: [
      {
        key: "code",
        name: "Code",
        defaultSize: 50,
        icon: (
          <CodeXml size={16} className="text-green-600 dark:text-green-400" />
        ),
        component: <SolutionEditor placeholder="Main solution code" />,
      },
      {
        key: "right-column",
        defaultSize: 50,
        direction: "vertical",
        children: [
          {
            key: "problem",
            name: "Problem",
            defaultSize: 55,
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
          },
          {
            key: "execution",
            name: "Execution",
            defaultSize: 45,
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
          },
        ],
      },
    ],
  };

  return (
    <SidebarLayout breadcrumbs={[]}>
      <Workspace tab={tabs} />
    </SidebarLayout>
  );
}
