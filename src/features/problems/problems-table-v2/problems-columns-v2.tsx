import { ColumnDef } from "@tanstack/react-table";
import { ProblemDifficultyBadge } from "@/shared/components/problem-difficulty-badge";
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
