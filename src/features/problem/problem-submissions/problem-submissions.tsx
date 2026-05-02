"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import React, { useCallback } from "react";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import SubmissionCard from "./submission-card";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0";

type ProblemSubmissionsProps = React.ComponentProps<typeof Card> & {
  isLoading?: boolean;
};

export default function ProblemSubmissions({
  isLoading,
  ...props
}: ProblemSubmissionsProps) {
  const { user } = useUser();
  const submissions = useProblemSubmissionsStore((s) => s.submissions);
  const filterMode = useProblemSubmissionsStore((s) => s.filterMode);
  const setFilterMode = useProblemSubmissionsStore((s) => s.setFilterMode);

  const handleFilterChange = useCallback(
    (mode: "all" | "mine") => {
      setFilterMode(mode);
    },
    [setFilterMode]
  );

  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Solutions</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filterMode === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("all")}
            >
              All Solutions
            </Button>
            <Button
              variant={filterMode === "mine" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("mine")}
              disabled={!user}
            >
              My Solutions
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 text-muted-foreground py-8">
            <Spinner className="size-4" />
            <span>Loading solutions...</span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {filterMode === "mine"
              ? "You haven't submitted any accepted solutions yet."
              : "No accepted solutions yet."}
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
