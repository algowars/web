"use client";

import ProblemLoading from "@/app/problems/[slug]/loading";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import ProblemTestCases from "@/domains/problem/components/problem-test-cases";
import { Problem } from "@/domains/problem/models/problem";
import { useInitializeProblem } from "@/domains/problem/hooks/use-problem-actions";
import { useProblemSetupSync } from "@/domains/problem/hooks/use-problem-setup-sync";
import SubmissionStatusPanel from "@/domains/submission/components/submission-status-panel";
import Workspace from "@/domains/workspace/components/workspace";
import { WorkspaceHeader } from "@/domains/workspace/components/workspace-header";
import type { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import {
  useWorkspaceStore,
  selectActiveSubmissionId,
  selectIsSubmittingSubmission,
} from "@/domains/workspace/state/workspace-store";
import { CodeXml, FileText, FlaskConical } from "lucide-react";
import { useEffect, useMemo } from "react";
import ProblemSolutionEditor from "./problem-solution-editor";

type ProblemLayoutProps = {
  problem: Problem;
};

export default function ProblemLayout({
  problem,
}: Readonly<ProblemLayoutProps>) {
  const isMobile = useIsMobile();
  const initializeProblem = useInitializeProblem();
  const { setup } = useProblemSetupSync();
  const activeSubmissionId = useWorkspaceStore(selectActiveSubmissionId);
  const isSubmittingSubmission = useWorkspaceStore(
    selectIsSubmittingSubmission
  );

  useEffect(() => {
    initializeProblem(problem);
  }, [initializeProblem, problem]);

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
      ],
    };

    const mobileProblemTab: EditorWindowTabNode = {
      key: "problem",
      name: "Problem",
      icon: <FileText size={16} className="text-blue-600 dark:text-blue-400" />,
      component: <ProblemQuestion problem={problem} />,
    };

    const executionTabs: EditorWindowTabNode = {
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
          component: <ProblemTestCases testCases={problem?.publicTestCases} />,
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

    const mobileTestsTab: EditorWindowTabNode = {
      key: "tests",
      name: "Tests",
      icon: (
        <FlaskConical
          size={16}
          className="text-indigo-600 dark:text-indigo-400"
        />
      ),
      component: <ProblemTestCases testCases={problem?.publicTestCases} />,
    };

    const mobileSubmissionTab: EditorWindowTabNode = {
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
  }, [isMobile, problem, activeSubmissionId, isSubmittingSubmission]);

  if (isMobile === undefined) return <ProblemLoading />;

  return (
    <SidebarLayout
      breadcrumbs={[]}
      headerItems={
        <WorkspaceHeader problem={problem} problemSetupId={setup?.id ?? null} />
      }
    >
      <div className="h-full px-2 md:px-4 pb-2 md:pb-4">
        <Workspace tab={tabs} />
      </div>
    </SidebarLayout>
  );
}
