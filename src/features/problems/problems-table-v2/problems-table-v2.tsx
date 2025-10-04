"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { useProblems } from "../api/get-problems-pageable";
import { DataTable } from "@/components/ui/data-table";
import { problemColumnsV2 } from "./problems-columns-v2";

export default function ProblemsTableV2() {
  const [timestamp] = useState(new Date());
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const { data } = useProblems({
    pagination,
    timestamp,
  });

  return (
    <DataTable
      data={data?.results ?? []}
      rowCount={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      columns={problemColumnsV2}
    />
  );
}
