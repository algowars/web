"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Problem } from "../models/problem";

export const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
];
