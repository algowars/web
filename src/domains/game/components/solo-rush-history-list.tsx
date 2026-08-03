import { Check, History as HistoryIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { GameProblemDto } from "@/domains/game/api/game-api";

type SoloRushHistoryListProps = {
  /** All problems assigned so far, in ascending `order`. */
  problems: GameProblemDto[];
  /** `order` of the problem currently in play (unsolved, editable). */
  currentOrder: number;
  /** `order` of the problem currently being displayed. */
  viewedOrder: number;
  onSelect: (order: number) => void;
};

/**
 * Lists every problem assigned so far in this Solo Rush run so the player can
 * jump back to review a previously solved problem — its statement plus the
 * code/language they solved it with — and back to the one currently in play.
 * Lives as a tab alongside "Description" rather than a separate row so it
 * doesn't push the rest of the workspace down.
 */
export default function SoloRushHistoryList({
  problems,
  currentOrder,
  viewedOrder,
  onSelect,
}: Readonly<SoloRushHistoryListProps>) {
  return (
    <div className="flex flex-col gap-1 p-2">
      {problems.map((problem, index) => {
        const isSolved = problem.order < currentOrder;
        const isCurrent = problem.order === currentOrder;
        const isViewed = problem.order === viewedOrder;

        return (
          <button
            key={problem.problemId}
            type="button"
            onClick={() => onSelect(problem.order)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
              isViewed
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-muted/70"
            )}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                isSolved
                  ? "bg-lime-500/15 text-lime-600 dark:text-lime-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isSolved ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className="flex-1 truncate">
              {problem.title ?? `Problem ${index + 1}`}
            </span>
            {isCurrent ? (
              <span className="shrink-0 text-xs text-muted-foreground">
                In progress
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export const SoloRushHistoryTabIcon = (
  <HistoryIcon size={16} className="text-amber-600 dark:text-amber-400" />
);
