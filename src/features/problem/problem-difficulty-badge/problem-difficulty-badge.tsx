"use client";

import { Badge } from "@/components/ui/badge";

type ProblemDifficultyBadgeProps = {
  difficulty: number;
};

function getDifficultyLabel(difficulty: number): {
  label: string;
  className: string;
} {
  if (difficulty < 1000) {
    return {
      label: "Easy",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
  }
  if (difficulty < 2000) {
    return {
      label: "Medium",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
  }
  return {
    label: "Hard",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
}

export function ProblemDifficultyBadge({
  difficulty,
}: ProblemDifficultyBadgeProps) {
  const { label, className } = getDifficultyLabel(difficulty);

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}
