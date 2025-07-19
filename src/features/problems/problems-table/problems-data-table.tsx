"use client";

import React, { useState } from "react";
import { columns } from "./problems-columns";
import { DataTable } from "@/components/ui/data-table";
import { useProblems } from "../api/get-problems-pageable";

export default function ProblemsDataTable() {
  const [timestamp] = useState(new Date());
  const { data: results } = useProblems({
    page: 1,
    size: 25,
    timestamp,
  });

  return <DataTable data={results?.results ?? []} columns={columns} />;
}
