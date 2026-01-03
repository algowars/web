"use client";

import { Badge } from "@/components/ui/badge";

type ProblemDifficultyBadgeProps = {
  difficulty: number;
};

export function ProblemDifficultyBadge({
  difficulty,
}: ProblemDifficultyBadgeProps) {
  return <Badge variant="secondary">Difficulty: {difficulty}</Badge>;
}
