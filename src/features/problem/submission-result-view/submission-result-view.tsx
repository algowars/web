"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RunResult, RunResultTestCase } from "../models/run-result";
import { SubmissionResultStatus } from "../models/submission-result-status";
import SubmissionStatusBadge from "@/features/submission/submissions-status/submission-status-badge";
import { SubmissionStatus } from "../models/submission-status";

type SubmissionResultViewProps = {
  result: RunResult;
};

function testCaseStatusInfo(status: SubmissionResultStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case SubmissionResultStatus.Accepted:
      return {
        label: "Accepted",
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    case SubmissionResultStatus.WrongAnswer:
      return {
        label: "Wrong Answer",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    case SubmissionResultStatus.TimeLimitExceeded:
      return {
        label: "Time Limit Exceeded",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    case SubmissionResultStatus.CompilationError:
      return {
        label: "Compilation Error",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    case SubmissionResultStatus.RuntimeErrorSigSegv:
    case SubmissionResultStatus.RuntimeErrorSigXfsz:
    case SubmissionResultStatus.RuntimeErrorSigFpe:
    case SubmissionResultStatus.RuntimeErrorSigAbrt:
    case SubmissionResultStatus.RuntimeErrorNzec:
    case SubmissionResultStatus.RuntimeErrorOther:
      return {
        label: "Runtime Error",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    case SubmissionResultStatus.InternalError:
      return {
        label: "Internal Error",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    case SubmissionResultStatus.ExecFormatError:
      return {
        label: "Exec Format Error",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    default:
      return { label: "Processing", className: "" };
  }
}

function TestCaseTab({ testCase }: { testCase: RunResultTestCase }) {
  const { label, className } = testCaseStatusInfo(testCase.status);
  const matches =
    testCase.actualOutput !== undefined &&
    testCase.actualOutput === testCase.expectedOutput;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Badge variant="secondary" className={className}>
          {label}
        </Badge>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Input</label>
        <pre className="rounded-md bg-muted px-3 py-2 text-sm font-mono whitespace-pre-wrap">
          {testCase.input}
        </pre>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Expected Output
        </label>
        <pre className="rounded-md bg-muted px-3 py-2 text-sm font-mono whitespace-pre-wrap">
          {testCase.expectedOutput}
        </pre>
      </div>
      {testCase.actualOutput !== undefined && testCase.actualOutput !== "" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Actual Output
          </label>
          <pre
            className={`rounded-md px-3 py-2 text-sm font-mono whitespace-pre-wrap ${
              matches
                ? "bg-emerald-50 dark:bg-emerald-950/30"
                : "bg-red-50 dark:bg-red-950/30"
            }`}
          >
            {testCase.actualOutput}
          </pre>
        </div>
      )}
      {testCase.errorOutput && (
        <div>
          <label className="block text-sm font-medium mb-1">Error Output</label>
          <pre className="rounded-md bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm font-mono whitespace-pre-wrap text-red-700 dark:text-red-400">
            {testCase.errorOutput}
          </pre>
        </div>
      )}
    </div>
  );
}

const FINAL_STATUSES: SubmissionStatus[] = [
  SubmissionStatus.ACCEPTED,
  SubmissionStatus.WRONG_ANSWER,
];

export default function SubmissionResultView({
  result,
}: SubmissionResultViewProps) {
  const showStatusBadge = FINAL_STATUSES.includes(result.status);

  return (
    <div data-cy="submission-result-view" className="space-y-4 p-4">
      {showStatusBadge && (
        <div
          data-cy="submission-overall-status"
          className="flex items-center gap-2"
        >
          <SubmissionStatusBadge status={result.status} />
        </div>
      )}
      {result.testCases.length > 0 ? (
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="bg-card flex-wrap h-auto">
            {result.testCases.map((_, i) => (
              <TabsTrigger
                key={i}
                value={String(i)}
                data-cy={`test-case-tab-${i}`}
              >
                Test {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {result.testCases.map((tc, i) => (
            <TabsContent
              key={i}
              value={String(i)}
              data-cy={`test-case-panel-${i}`}
            >
              <TestCaseTab testCase={tc} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-sm text-muted-foreground">
          No test case results available.
        </p>
      )}
    </div>
  );
}
