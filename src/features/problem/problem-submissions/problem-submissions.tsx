"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { useProblemSubmissions } from "@/features/problem/api/get-problem-submissions";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useProblemSubmissionsStore } from "./problem-submissions-store";

export default function ProblemSubmissions() {
  const problem = useProblemSubmissionsStore((s) => s.problem);
  const submissions = useProblemSubmissionsStore((s) => s.submissions);
  const setSubmissions = useProblemSubmissionsStore((s) => s.setSubmissions);

  const { data, isLoading, isError, error } = useProblemSubmissions({
    problemId: problem?.id,
    queryConfig: {
      enabled: !!problem?.id,
    },
  });

  useEffect(() => {
    setSubmissions(data?.submissions ?? []);
  }, [data?.submissions, setSubmissions]);

  if (!problem) {
    return null;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Error loading submissions</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred while loading submissions."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table aria-busy={isLoading} aria-live="polite">
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className="h-24">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Spinner className="size-4" />
                    <span>Loading submissions...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell className="h-24 text-muted-foreground">
                  No submissions yet.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-mono text-xs sm:text-sm">
                    {submission.id}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
