"use client";

import React, { useState } from "react";
import { columns } from "./problems-columns";
import { DataTable } from "@/components/ui/data-table";
import { useProblems } from "../api/get-problems-pageable";

export default function ProblemsDataTable() {
  const [timestamp] = useState(new Date());
  const { data } = useProblems({
    page: 1,
    size: 25,
    timestamp,
  });

  console.log("DATA: ", data);

  return (
    <DataTable
      data={data?.results ?? []}
      pagination={{ pageIndex: data?.page ?? 1, pageSize: data?.size ?? 25 }}
      columns={columns}
    />
  );
}
