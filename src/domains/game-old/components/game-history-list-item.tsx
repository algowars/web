"use client";

import { CheckCircle2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { useGetProblemByIdQuery } from "@/domains/problem/api/problem-api";
import DifficultyBadge from "@/domains/problem/components/difficulty-badge";

type GameHistoryListItemProps = {
  problemId: string;
  order: number;
  isSelected: boolean;
  onSelect: (problemId: string) => void;
};

export default function GameHistoryListItem({
  problemId,
  order,
  isSelected,
  onSelect,
}: Readonly<GameHistoryListItemProps>) {
  const { data: problem, isLoading } = useGetProblemByIdQuery(problemId);

  return (
    <button
      type="button"
      onClick={() => onSelect(problemId)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors hover:bg-muted/50",
        isSelected && "border-primary bg-muted"
      )}
    >
      <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {isLoading
            ? `Problem ${order}`
            : (problem?.title ?? `Problem ${order}`)}
        </p>
      </div>
      {problem?.difficultyTier ? (
        <DifficultyBadge difficulty={problem.difficultyTier} />
      ) : null}
    </button>
  );
}
