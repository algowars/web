import Workspace from "@/domains/workspace/components/workspace";
import { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import SolutionEditor from "@/domains/workspace/solution-editor/components/solution-editor";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { CodeXml, FileText } from "lucide-react";

export default function ProblemLayout() {
  const tabs: EditorWindowTabNode = {
    direction: "horizontal",
    children: [
      {
        name: "Code",
        key: "code",
        defaultSize: 55,
        icon: (
          <CodeXml size={16} className="text-green-600 dark:text-green-400" />
        ),
        component: (
          <>
            <SolutionEditor />
          </>
        ),
      },
      {
        direction: "vertical",
        defaultSize: 45,
        children: [
          {
            component: <p>Hello world</p>,
            key: "description",
            name: "Description",
            defaultSize: 70,
            icon: (
              <FileText
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
            ),
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
