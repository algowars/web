"use client";

import { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { CodeXml, FileText, FlaskConical, History } from "lucide-react";
import { useMemo } from "react";
import ProblemSolutionEditor from "@/views/problems/problem/problem-solution-editor";
import { useAppSelector } from "@/shared/state/hooks";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import { selectCurrentProblem } from "@/domains/problem/state/problem-setup-slice";
import { EditorWindow } from "@/domains/workspace/editor-window/editor";
import ProblemTestCases from "@/domains/problem/components/problem-test-cases";
import SubmissionStatusPanel from "@/domains/submission/components/submission-status-panel";

/**
 * Solo Rush's implementation of the workspace strategy.
 * Everything here (tabs, mobile layout, code editor) is
 * specific to Solo Rush — other modes will look nothing
 * like this.
 */
export default function SoloRushWorkspace() {
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

    const executionTabs = {
      key: "execution",
      name: "Execution",
      children: [
        {
          key: "tests",
          name: "Tests",
          icon: (
            <FlaskConical
              size={16}
              className="text-indigo-600 dark:text-indigo-400"
            />
          ),
          component: (
            <ProblemTestCases
              testCases={currentProblem?.publicTestCases ?? []}
            />
          ),
        },
        {
          key: "submission",
          name: "Submission",
          icon: (
            <FlaskConical
              size={16}
              className="text-indigo-600 dark:text-indigo-400"
            />
          ),
          component: <SubmissionStatusPanel />,
        },
      ],
    };

    const mobileTestsTab = {
      key: "tests",
      name: "Tests",
      icon: (
        <FlaskConical
          size={16}
          className="text-indigo-600 dark:text-indigo-400"
        />
      ),
      component: (
        <ProblemTestCases testCases={currentProblem?.publicTestCases ?? []} />
      ),
    };

    const mobileSubmissionTab = {
      key: "submission",
      name: "Submission",
      icon: (
        <FlaskConical
          size={16}
          className="text-indigo-600 dark:text-indigo-400"
        />
      ),
      component: <SubmissionStatusPanel />,
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
          mobileTestsTab,
          mobileSubmissionTab,
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
  }, [currentProblem, isMobile]);

  return <EditorWindow tabs={tabs} />;
}
