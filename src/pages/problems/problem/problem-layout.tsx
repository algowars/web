"use client";

import ProblemLoading from "@/app/problems/[slug]/loading";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import { Problem } from "@/domains/problem/models/problem";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import Workspace from "@/domains/workspace/components/workspace";
import { WorkspaceHeader } from "@/domains/workspace/components/workspace-header";
import type { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { useAppDispatch } from "@/shared/state/hooks";
import { CodeXml, FileText, Terminal } from "lucide-react";
import { useEffect, useMemo } from "react";
import ProblemSolutionEditor from "./problem-solution-editor";

type ProblemLayoutProps = {
  problem: Problem;
};

export default function ProblemLayout({
  problem,
}: Readonly<ProblemLayoutProps>) {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(ProblemEvents.initializeProblem(problem));
  }, [dispatch, problem]);

  const tabs = useMemo((): EditorWindowTabNode => {
    const problemTabs: EditorWindowTabNode = {
      key: "problem",
      name: "Problem",
      children: [
        {
          key: "description",
          name: "Description",
          icon: (
            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
          ),
          component: <ProblemQuestion problem={problem} />,
        },
        // {
        //   key: "examples",
        //   name: "Examples",
        //   icon: (
        //     <FileText size={16} className="text-sky-600 dark:text-sky-400" />
        //   ),
        //   component: (
        //     <Markdown
        //       content={
        //         "# Examples\n\nThis is where the example inputs and outputs will go."
        //       }
        //     />
        //   ),
        // },
      ],
    };

    const executionTabs: EditorWindowTabNode = {
      key: "execution",
      name: "Execution",
      children: [
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

    if (isMobile) {
      return {
        children: [
          {
            key: "code",
            name: "Code",
            icon: (
              <CodeXml
                size={16}
                className="text-green-600 dark:text-green-400"
              />
            ),
            component: <ProblemSolutionEditor />,
          },
          {
            ...problemTabs,
            icon: (
              <FileText
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
            ),
          },
          {
            ...executionTabs,
            icon: (
              <Terminal
                size={16}
                className="text-indigo-600 dark:text-indigo-400"
              />
            ),
          },
        ],
      };
    }

    return {
      orientation: "horizontal",
      children: [
        {
          key: "code",
          name: "Code",
          defaultSize: 50,
          icon: (
            <CodeXml size={16} className="text-green-600 dark:text-green-400" />
          ),
          component: <ProblemSolutionEditor />,
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
  }, [isMobile, problem]);

  if (isMobile === undefined) return <ProblemLoading />;

  return (
    <SidebarLayout
      breadcrumbs={[]}
      headerItems={<WorkspaceHeader problem={problem} />}
    >
      <Workspace tab={tabs} />
    </SidebarLayout>
  );
}
