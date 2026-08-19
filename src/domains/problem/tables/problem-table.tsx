"use client";

import { useEffect } from "react";
import {
  ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import DifficultyBadge from "../components/difficulty-badge";
import { useProblemListStore } from "../state/problem-list-store";

import { DataTable } from "@/shared/components/ui/data-table";
import { routerConfig } from "@/shared/router-config";
import { ProblemSummary } from "../models/problem-summary";
import { useProblems } from "../api/use-problems";

const columns: ColumnDef<ProblemSummary>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficultyTier",
    header: "Difficulty",
    cell: ({ row }) => (
      <DifficultyBadge difficulty={row.original.difficultyTier} />
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.tags.join(", ")}
      </span>
    ),
  },
];

export default function ProblemTable() {
  const router = useRouter();

  const pageIndex = useProblemListStore((s) => s.pageIndex);
  const pageSize = useProblemListStore((s) => s.pageSize);
  const timestamp = useProblemListStore((s) => s.timestamp);
  const setPagination = useProblemListStore((s) => s.setPagination);
  const resetSession = useProblemListStore((s) => s.resetSession);

  useEffect(() => {
    resetSession();
  }, [resetSession]);

  const { data, isLoading } = useProblems({
    page: pageIndex + 1,
    size: pageSize,
    timestamp,
  });

  const handleRowClick = (problem: ProblemSummary) => {
    if (!problem.slug) {
      return;
    }

    router.push(routerConfig.problem.execute({ slug: problem.slug }));
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next =
      typeof updater === "function"
        ? updater({ pageIndex, pageSize })
        : updater;
    setPagination(next.pageIndex, next.pageSize);
  };

  const pageCount = data
    ? (data.totalPages ?? Math.max(1, Math.ceil(data.total / pageSize)))
    : -1;

  return (
    <DataTable
      isLoading={isLoading}
      skeletonRows={5}
      data={data?.results ?? []}
      columns={columns}
      onRowClick={handleRowClick}
      paginationProps={{}}
      manualPagination={{
        pagination: { pageIndex, pageSize },
        onPaginationChange: handlePaginationChange,
        pageCount,
      }}
    />
  );
}
