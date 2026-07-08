"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import DifficultyBadge from "../components/difficulty-badge";
import { selectProblems, selectProblemsLoading } from "../state/problem-slice";

import { DataTable } from "@/shared/components/ui/data-table";
import { routerConfig } from "@/shared/router-config";
import { ProblemSummary } from "../models/problem-summary";
import { useAppSelector } from "@/shared/state/hooks";

const columns: ColumnDef<ProblemSummary>[] = [
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
  const router = useRouter();
  const problems = useAppSelector(selectProblems);
  const isLoading = useAppSelector(selectProblemsLoading);

  const handleRowClick = (problem: ProblemSummary) => {
    if (!problem.slug) {
      return;
    }

    router.push(routerConfig.problem.execute({ slug: problem.slug }));
  };

  return (
    <DataTable
      isLoading={isLoading}
      skeletonRows={5}
      data={problems}
      columns={columns}
      onRowClick={handleRowClick}
      paginationProps={{}}
    />
  );
}
