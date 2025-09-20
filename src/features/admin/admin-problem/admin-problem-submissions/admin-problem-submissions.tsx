"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

type AdminProblemSubmissionsProps = React.ComponentProps<typeof Card>;

export default function AdminProblemSubmissions(
  props: AdminProblemSubmissionsProps
) {
  const totalSubmissions = Math.floor(Math.random() * 1000) + 1;

  return (
    <Card {...props}>
      <CardHeader className="flex flex-row items-center gap-3">
        <BarChart3 />
        <CardTitle>Total Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{totalSubmissions}</div>
      </CardContent>
    </Card>
  );
}
