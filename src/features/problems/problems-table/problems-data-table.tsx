"use client";

import React, { useState } from "react";
import { columns } from "./problems-columns";
import { DataTable } from "@/components/ui/data-table";
import { useProblems } from "../api/get-problems-pageable";
import { PaginationState } from "@tanstack/react-table";

export default function ProblemsDataTable() {
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
      pagination={{ pageIndex: data?.page ?? 1, pageSize: data?.size ?? 25 }}
      columns={columns}
    />
  );
}
