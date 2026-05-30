"use client";

import { Editor, Tab } from "@/shared/components/editor/editor";
import { CodeXml, FileText, FlaskConical } from "lucide-react";
import ProblemQuestion from "../problem-question/problem-question";
import { CodeEditor } from "@/shared/components/code-editor/code-editor";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useProblemEditorStore } from "../problem-editor-store";
import ProblemTestCases from "../problem-test-cases/problem-test-cases";
import SubmissionResultView from "../submission-result-view/submission-result-view";
import SubmissionResultTab from "../submission-result-tab/submission-result-tab";
import { RunResult } from "../models/run-result";

export default function ProblemEditor() {
  const setup = useProblemEditorStore((s) => s.setup);
  const problem = useProblemEditorStore((s) => s.problem);
  const lastRunResult = useProblemEditorStore((s) => s.lastRunResult);
  const activeSubmissionId = useProblemEditorStore((s) => s.activeSubmissionId);
  const setLastRunResult = useProblemEditorStore((s) => s.setLastRunResult);
  const setActiveSubmissionId = useProblemEditorStore(
    (s) => s.setActiveSubmissionId
  );

  if (!setup || !problem) {
    return (
      <div className="h-full p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const handleSubmissionComplete = (result: RunResult) => {
    setLastRunResult(result);
    setActiveSubmissionId(null);
  };

  const resultsIcon = (
    <FileText size={16} className="text-yellow-600 dark:text-yellow-400" />
  );

  const testCasesTab = {
    component: <ProblemTestCases />,
    key: "test-cases",
    name: "Test Cases",
    icon: (
      <FlaskConical size={16} className="text-blue-600 dark:text-blue-400" />
    ),
  };

  const bottomRightChildren = activeSubmissionId
    ? [
        {
          component: (
            <SubmissionResultTab
              submissionId={activeSubmissionId}
              onComplete={handleSubmissionComplete}
            />
          ),
          key: "submission-result",
          name: "Results",
          icon: resultsIcon,
        },
        testCasesTab,
      ]
    : lastRunResult
      ? [
          {
            component: <SubmissionResultView result={lastRunResult} />,
            key: "submission-result",
            name: "Results",
            icon: resultsIcon,
          },
          testCasesTab,
        ]
      : [testCasesTab];

  const tabs: Tab = {
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
            <CodeEditor className="h-full overflow-auto" />
          </>
        ),
      },
      {
        direction: "vertical",
        defaultSize: 45,
        children: [
          {
            component: <ProblemQuestion problem={problem} />,
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
          {
            key: "test-cases-results",
            defaultSize: 30,
            children: bottomRightChildren,
          },
        ],
      },
    ],
  };

  return <Editor tabs={tabs} />;
}
