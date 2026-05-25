import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Problem } from "../models/problem";

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

export const problemColumnsV2: ColumnDef<Problem>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const { label, className } = getDifficultyLabel(row.original.difficulty);

      return (
        <Badge variant="secondary" className={className}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
];
