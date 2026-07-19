import { Badge } from "@/shared/components/ui/badge";

const tiers = {
  easy: {
    label: "Easy",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  hard: {
    label: "Hard",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

type DifficultyBadgeProps = {
  readonly difficulty: string;
};

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { label, className } =
    tiers[difficulty.toLowerCase() as keyof typeof tiers];

  if (!label || !className) {
    return null;
  }

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}
