"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { Problem } from "../models/problem";
import DifficultyBadge from "../components/difficulty-badge";
import { useProblemsStore } from "../state/problems-store";

import { DataTable } from "@/shared/components/ui/data-table";
import { routerConfig } from "@/shared/router-config";

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
  const router = useRouter();
  const problems = useProblemsStore((s) => s.problems);
  const isLoading = useProblemsStore((s) => s.isLoading);

  const handleRowClick = (problem: Problem) => {
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
