"use client";

import React from "react";
import { useAdminProblemContext } from "../admin-problem-context";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProblemHeader() {
  const context = useAdminProblemContext();
  const problem = context?.problem;

  if (!problem) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{problem.title}</CardTitle>
      </CardHeader>
    </Card>
  );
}
