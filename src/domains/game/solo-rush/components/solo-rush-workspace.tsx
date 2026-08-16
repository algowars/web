"use client";

import { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { CodeXml, FileText, History } from "lucide-react";
import { useMemo } from "react";
import ProblemSolutionEditor from "@/views/problems/problem/problem-solution-editor";
import { useAppSelector } from "@/shared/state/hooks";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import { selectCurrentProblem } from "@/domains/problem/state/problem-setup-slice";
import { GameWorkspaceProps } from "@/domains/game/models/game-workspace";
import { EditorWindow } from "@/domains/workspace/editor-window/editor";

/**
 * Solo Rush's implementation of the workspace strategy.
 * Everything here (tabs, mobile layout, code editor) is
 * specific to Solo Rush — other modes will look nothing
 * like this.
 */
export default function SoloRushWorkspace({
  game,
}: Readonly<GameWorkspaceProps>) {
  const currentProblem = useAppSelector(selectCurrentProblem);
  const isMobile = useIsMobile();

  const tabs = useMemo((): EditorWindowTabNode => {
    const problemTabs = {
      key: "problem",
      name: "Problem",
      children: [
        {
          key: "description",
          name: "Description",
          icon: (
            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
          ),
          component: currentProblem ? (
            <ProblemQuestion problem={currentProblem} />
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              Loading problem...
            </div>
          ),
        },
        {
          key: "history",
          name: "History",
          icon: (
            <History
              size={16}
              className="text-purple-600 dark:text-purple-400"
            />
          ),
          component: <div></div>,
        },
      ],
    };

    const mobileProblemTab = {
      key: "problem",
      name: "Problem",
      icon: <FileText size={16} className="text-blue-600 dark:text-blue-400" />,
      component: currentProblem ? (
        <ProblemQuestion problem={currentProblem} />
      ) : (
        <div className="p-4 text-sm text-muted-foreground">
          Loading problem...
        </div>
      ),
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
          mobileProblemTab,
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
          ],
        },
      ],
    };
  }, [currentProblem, isMobile]);

  return <EditorWindow tabs={tabs} />;
}
