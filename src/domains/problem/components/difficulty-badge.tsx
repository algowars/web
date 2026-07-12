import { Badge } from "@/shared/components/ui/badge";

const EASY_THRESHOLD = 1;
const MEDIUM_THRESHOLD = 2;

function getDifficultyLabel(difficulty: number): {
  label: string;
  className: string;
} {
  if (difficulty <= EASY_THRESHOLD) {
    return {
      label: "Easy",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
  }
  if (difficulty <= MEDIUM_THRESHOLD) {
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

type DifficultyBadgeProps = {
  readonly difficulty: number;
};

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { label, className } = getDifficultyLabel(difficulty);

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}
