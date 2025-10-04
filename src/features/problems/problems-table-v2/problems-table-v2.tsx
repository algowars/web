"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import { useState } from "react";
import { useProblems } from "../api/get-problems-pageable";
import { DataTable } from "@/components/ui/data-table";
import { problemColumnsV2 } from "./problems-columns-v2";
import { routerConfig } from "@/router-config";

export default function ProblemsTableV2() {
  const [timestamp] = useState(new Date());
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isFetching } = useProblems({ pagination, timestamp });

  return (
    <DataTable
      data={data?.results ?? []}
      rowCount={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      columns={problemColumnsV2}
      isLoading={isFetching}
      getRowUrl={(row) => routerConfig.problem.execute({ slug: row.slug })}
      manual
    />
  );
}
