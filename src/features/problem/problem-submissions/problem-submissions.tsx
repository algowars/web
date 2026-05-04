"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useSuspenseProblemSubmissionsWithStore } from "./problem-submissions-store";
import SubmissionCard from "./submission-card";

type ProblemSubmissionsProps = React.ComponentProps<typeof Card>;

export function ProblemSubmissionsEmpty(props: ProblemSubmissionsProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          No accepted solutions yet.
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProblemSubmissions(props: ProblemSubmissionsProps) {
  const { data } = useSuspenseProblemSubmissionsWithStore();
  const submissions = data?.results ?? [];

  if (submissions.length === 0) {
    return <ProblemSubmissionsEmpty {...props} />;
  }

  if (!submissions.length) {
    return (
      <Card {...props}>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No accepted solutions yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
