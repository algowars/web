import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Problem } from "../models/problem";

export const problemColumnsV2: ColumnDef<Problem>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.original.difficulty;
      const label =
        difficulty < 1000 ? "Easy" : difficulty < 2000 ? "Medium" : "Hard";
      const className =
        difficulty < 1000
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : difficulty < 2000
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

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
