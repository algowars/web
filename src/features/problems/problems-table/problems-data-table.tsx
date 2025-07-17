"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

interface ProblemsDataTable {
  page: number;
  size: number;
  timestamp: Date;
}

export default function ProblemsDataTable({ columns, data }) {
  return <div>ProblemsDataTable</div>;
}
