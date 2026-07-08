"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { DataTableSkeleton } from "@/shared/components/ui/data-table-skeleton";
import {
  DataTablePagination,
  DataTablePaginationProps,
} from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  skeletonRows: number;
  paginationProps?: Omit<DataTablePaginationProps<TData>, "table">;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  skeletonRows = 5,
  paginationProps,
  onRowClick,
}: Readonly<DataTableProps<TData, TValue>>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  let tableBodyContent: React.ReactNode;

  if (isLoading) {
    tableBodyContent = (
      <DataTableSkeleton rowCount={skeletonRows} columnCount={columns.length} />
    );
  } else if (rows.length > 0) {
    tableBodyContent = rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className={onRowClick ? "cursor-pointer" : undefined}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  } else {
    tableBodyContent = (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          No results.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{tableBodyContent}</TableBody>
        </Table>
      </div>
      {paginationProps ? (
        <DataTablePagination {...paginationProps} table={table} />
      ) : null}
    </div>
  );
}
