import React from "react";
import { useAdminProblemContext } from "../admin-problem-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProblemOverview() {
  const context = useAdminProblemContext();
  const problem = context?.problem;

  if (!problem) {
    return (
      <div className="text-muted-foreground">No problem data available.</div>
    );
  }

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-2xl font-semibold mb-4">{problem.title}</h3>
        <p>{problem.question}</p>
      </CardContent>
    </Card>
  );
}
