"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Problem } from "../models/problem";
import DifficultyBadge from "../components/difficulty-badge";

const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => <DifficultyBadge difficulty={row.original.difficulty} />,
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
];

export default function ProblemTable() {
    const table = 
}
