import { ColumnDef } from "@tanstack/react-table";
import { Problem } from "../models/problem";

export const problemColumnsV2: ColumnDef<Problem>[] = [
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
