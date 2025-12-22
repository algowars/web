"use client";

import { Editor, Tab } from "@/components/editor/editor";
import { CodeXml, FileText, FlaskConical } from "lucide-react";
import ProblemQuestion from "../problem-question/problem-question";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { useProblemEditorStore } from "../problem-editor-store";
import ProblemTestCases from "../problem-test-cases/problem-test-cases";
import SubmissionResult from "../submission-result/submission-result";

type ProblemEditorProps = {
  accessToken?: string;
};

export default function ProblemEditor({ accessToken }: ProblemEditorProps) {
  const setup = useProblemEditorStore((s) => s.setup);
  const problem = useProblemEditorStore((s) => s.problem);
  const lastRunResult = useProblemEditorStore((s) => s.lastRunResult);

  if (!setup || !problem) {
    return (
      <div className="h-full p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

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
            children: !!lastRunResult
              ? [
                  {
                    component: (
                      <SubmissionResult accessToken={accessToken ?? ""} />
                    ),
                    key: "submission-result",
                    name: "Results",
                    icon: (
                      <FileText
                        size={16}
                        className="text-yellow-600 dark:text-yellow-400"
                      />
                    ),
                  },
                  {
                    component: <ProblemTestCases />,
                    key: "test-cases",
                    name: "Test Cases",
                    icon: (
                      <FlaskConical
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    ),
                  },
                ]
              : [
                  {
                    component: <ProblemTestCases />,
                    key: "test-cases",
                    name: "Test Cases",
                    defaultSize: 30,
                    icon: (
                      <FlaskConical
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    ),
                  },
                ],
          },
        ],
      },
    ],
  };

  return <Editor tabs={tabs} />;
}
