"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import SubmissionCard from "./submission-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProblemSubmissionsProps = React.ComponentProps<typeof Card> & {
  isLoading?: boolean;
};

export default function ProblemSubmissions({
  isLoading,
  ...props
}: ProblemSubmissionsProps) {
  const submissions = useProblemSubmissionsStore((s) => s.submissions);

  return (
    <Card {...props}>
      <CardHeader>
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All Submissions</TabsTrigger>
            <TabsTrigger value="mine">My Submissions</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 text-muted-foreground py-8">
            <Spinner className="size-4" />
            <span>Loading solutions...</span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <span> No accepted solutions yet.</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
