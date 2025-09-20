"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Percent } from "lucide-react";

type AdminProblemAcceptanceRateProps = React.ComponentProps<typeof Card>;

export default function AdminProblemAcceptanceRate(
  props: AdminProblemAcceptanceRateProps
) {
  const acceptanceRate = (Math.random() * 100).toFixed(2);

  return (
    <Card className="" {...props}>
      <CardHeader className="flex flex-row items-center gap-3">
        <Percent />
        <CardTitle>Acceptance Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{acceptanceRate}%</div>
      </CardContent>
    </Card>
  );
}
