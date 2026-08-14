"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import DifficultyBadge from "@/domains/problem/components/difficulty-badge";
import type { Problem } from "@/domains/problem/models/problem";

type GameHistoryCurrentListItemProps = {
  problem: Problem | null;
  isSelected: boolean;
  onSelect: (problemId: string) => void;
};

export default function GameHistoryCurrentListItem({
  problem,
  isSelected,
  onSelect,
}: Readonly<GameHistoryCurrentListItemProps>) {
  if (!problem) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(problem.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border border-dashed px-3 py-2 text-left transition-colors hover:bg-muted/50",
        isSelected && "border-primary border-solid bg-muted"
      )}
    >
      <Loader2 className="size-4 shrink-0 animate-spin text-blue-600 dark:text-blue-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{problem.title}</p>
        <p className="text-xs text-muted-foreground">In progress</p>
      </div>
      {problem.difficultyTier ? (
        <DifficultyBadge difficulty={problem.difficultyTier} />
      ) : null}
    </button>
  );
}
