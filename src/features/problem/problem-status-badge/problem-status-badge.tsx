"use client";

import { Badge } from "@/components/ui/badge";
import { ProblemStatus } from "@/features/problems/models/problem-status";

type ProblemStatusBadgeProps = {
  status: ProblemStatus;
};

const statusMap: Record<
  ProblemStatus,
  {
    label: string;
    color:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | null
      | undefined;
  }
> = {
  [ProblemStatus.ACCEPTED]: { label: "Accepted", color: "secondary" },
  [ProblemStatus.PENDING]: { label: "Attempted", color: "outline" },
  [ProblemStatus.REJECTED]: { label: "Unattempted", color: "destructive" },
};

export function ProblemStatusBadge({ status }: ProblemStatusBadgeProps) {
  const badge = statusMap[status] ?? { label: status, color: "default" };
  return <Badge variant={badge.color}>{badge.label}</Badge>;
}
