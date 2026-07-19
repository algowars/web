"use client";

import {
  submissionApi,
  type SubmissionResultStatus,
  type SubmissionStatus,
  useGetSubmissionStatusQuery,
} from "@/domains/submission/api/submission-api";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  selectActiveSubmissionId,
  selectIsSubmittingSubmission,
} from "@/domains/workspace/state/workspace-slice";
import { useAppSelector } from "@/shared/state/hooks";
import { Check, X } from "lucide-react";

const pendingSubmissionStatuses = new Set<SubmissionStatus>([
  "Queued",
  "Running",
]);
const pendingResultStatuses = new Set<SubmissionResultStatus>([
  "Pending",
  "Processing",
]);

const isPendingSubmissionStatus = (status: SubmissionStatus) =>
  pendingSubmissionStatuses.has(status);

const isPendingResultStatus = (status: SubmissionResultStatus) =>
  pendingResultStatuses.has(status);

const isFailedResultStatus = (status: SubmissionResultStatus) =>
  !isPendingResultStatus(status) && status !== "Accepted";

const getStatusVariant = (
  status: SubmissionStatus | SubmissionResultStatus
) => {
  if (
    status === "WrongAnswer" ||
    status === "TimeLimitExceeded" ||
    status === "MemoryLimitExceeded" ||
    status === "RuntimeError" ||
    status === "CompileError"
  ) {
    return "destructive" as const;
  }

  return "secondary" as const;
};

const getStatusClassName = (
  status: SubmissionStatus | SubmissionResultStatus
) => {
  if (status === "Accepted") {
    return "bg-green-600 text-white hover:bg-green-600/90";
  }

  return undefined;
};

const getQueryErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return "Failed to load submission status.";
  }

  if ("status" in error) {
    const { status } = error;

    if (typeof status === "string" || typeof status === "number") {
      return `Failed to load submission status (${status}).`;
    }
  }

  return "Failed to load submission status.";
};

const OutputBlock = ({
  title,
  value,
}: {
  title: string;
  value: string | null;
}) => {
  if (!value) {
    return null;
  }

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-md border bg-muted/40 px-3 py-2 font-mono text-sm">
        {value}
      </pre>
    </div>
  );
};

export default function SubmissionStatusPanel() {
  const submissionId = useAppSelector(selectActiveSubmissionId);
  const isSubmittingSubmission = useAppSelector(selectIsSubmittingSubmission);
  const cachedSubmissionStatus = useAppSelector((state) =>
    submissionId
      ? submissionApi.endpoints.getSubmissionStatus.select(submissionId)(state)
          .data
      : undefined
  );
  const shouldPoll =
    !!submissionId &&
    (!cachedSubmissionStatus ||
      isPendingSubmissionStatus(cachedSubmissionStatus.status));
  const { data, error, isLoading } = useGetSubmissionStatusQuery(
    submissionId ?? "",
    {
      skip: !submissionId,
      pollingInterval: shouldPoll ? 1500 : 0,
      refetchOnMountOrArgChange: true,
    }
  );

  if (!submissionId) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center p-4 text-sm text-muted-foreground">
        {isSubmittingSubmission
          ? "Submitting your solution..."
          : "Submit your solution to see live execution status here."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center p-4 text-sm text-destructive">
        {getQueryErrorMessage(error)}
      </div>
    );
  }

  let resultsContent = null;

  if (data?.results?.length) {
    resultsContent = (
      <Tabs
        defaultValue="result-0"
        className="flex min-h-0 flex-1 flex-col"
        aria-label="Submission test results"
      >
        <div className="overflow-x-auto pb-1">
          <TabsList>
            {data.results.map((result, index) => {
              let statusIcon = null;

              if (result.status === "Accepted") {
                statusIcon = (
                  <Check size={14} className="mr-1 text-green-600" />
                );
              } else if (isFailedResultStatus(result.status)) {
                statusIcon = <X size={14} className="mr-1 text-destructive" />;
              }

              return (
                <TabsTrigger
                  key={`result-tab-${index}`}
                  value={`result-${index}`}
                  className="mr-2 shrink-0"
                >
                  {statusIcon}
                  Test {index + 1}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {data.results.map((result, index) => (
          <TabsContent
            key={`result-content-${index}`}
            value={`result-${index}`}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">
                  Test result {index + 1}
                </h4>
                <Badge
                  variant={getStatusVariant(result.status)}
                  className={getStatusClassName(result.status)}
                >
                  {result.status}
                </Badge>
              </div>

              {isPendingResultStatus(result.status) ? (
                <p className="text-sm text-muted-foreground">
                  This test case is still being processed.
                </p>
              ) : null}

              {result.runtime !== null || result.memoryUsed !== null ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Runtime
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {result.runtime !== null ? `${result.runtime} ms` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Memory
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {result.memoryUsed !== null
                        ? `${result.memoryUsed} KB`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ) : null}

              <OutputBlock title="Actual Output" value={result.actualOutput} />
              <OutputBlock
                title="Expected Output"
                value={result.expectedOutput}
              />
              <OutputBlock
                title="Standard Output"
                value={result.standardOutput}
              />
              <OutputBlock
                title="Standard Error"
                value={result.standardError}
              />
              <OutputBlock
                title="Compile Output"
                value={result.compileOutput}
              />
            </section>
          </TabsContent>
        ))}
      </Tabs>
    );
  } else if (data && !isPendingSubmissionStatus(data.status)) {
    resultsContent = (
      <div className="text-sm text-muted-foreground">
        This submission completed without any test result details.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold">Latest submission</h3>
          {data ? (
            <Badge
              variant={getStatusVariant(data.status)}
              className={getStatusClassName(data.status)}
            >
              {data.status}
            </Badge>
          ) : null}
        </div>
        {isLoading && !data ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Loading submission status...
          </p>
        ) : null}
        {data && isPendingSubmissionStatus(data.status) ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Your submission is still being processed. Status updates will appear
            automatically.
          </p>
        ) : null}
      </section>

      {resultsContent}
    </div>
  );
}
