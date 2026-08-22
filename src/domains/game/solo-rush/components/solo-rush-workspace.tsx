"use client";

import { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { CodeXml, FileText, FlaskConical, History } from "lucide-react";
import { useMemo } from "react";
import SolutionEditor from "@/domains/workspace/solution-editor/components/solution-editor";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import {
  useProblemSetupStore,
  selectCurrentProblem,
} from "@/domains/problem/state/problem-setup-store";
import { EditorWindow } from "@/domains/workspace/editor-window/editor";
import ProblemTestCases from "@/domains/problem/components/problem-test-cases";
import SubmissionStatusPanel from "@/domains/submission/components/submission-status-panel";
import {
  useWorkspaceStore,
  selectWorkspaceCode,
  selectActiveSubmissionId,
  selectIsSubmittingSubmission,
  selectActiveTabByNode,
} from "@/domains/workspace/state/workspace-store";

/**
 * Solo Rush's implementation of the workspace strategy.
 * Everything here (tabs, mobile layout, code editor) is
 * specific to Solo Rush — other modes will look nothing
 * like this. Reads problem/code/submission state from the
 * zustand stores.
 */
export default function SoloRushWorkspace() {
  const currentProblem = useProblemSetupStore(selectCurrentProblem);
  const code = useWorkspaceStore(selectWorkspaceCode);
  const setCode = useWorkspaceStore((s) => s.setCode);
  const activeSubmissionId = useWorkspaceStore(selectActiveSubmissionId);
  const isSubmittingSubmission = useWorkspaceStore(
    selectIsSubmittingSubmission
  );
  const activeTabByNode = useWorkspaceStore(selectActiveTabByNode);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
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
          component: (
            <SubmissionStatusPanel
              submissionId={activeSubmissionId}
              isSubmitting={isSubmittingSubmission}
            />
          ),
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
      component: (
        <SubmissionStatusPanel
          submissionId={activeSubmissionId}
          isSubmitting={isSubmittingSubmission}
        />
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
            component: <SolutionEditor value={code} onChange={setCode} />,
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
          component: <SolutionEditor value={code} onChange={setCode} />,
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
  }, [
    currentProblem,
    isMobile,
    code,
    setCode,
    activeSubmissionId,
    isSubmittingSubmission,
  ]);

  return (
    <EditorWindow
      tabs={tabs}
      activeTabByNode={activeTabByNode}
      onTabActivate={setActiveTab}
    />
  );
}
