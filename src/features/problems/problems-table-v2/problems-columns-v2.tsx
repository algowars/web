import { ColumnDef } from "@tanstack/react-table";
import { ProblemDifficultyBadge } from "@/features/problem/problem-difficulty-badge/problem-difficulty-badge";
import { Problem } from "../models/problem";

export const problemColumnsV2: ColumnDef<Problem>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => (
      <ProblemDifficultyBadge difficulty={row.original.difficulty} />
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
];
