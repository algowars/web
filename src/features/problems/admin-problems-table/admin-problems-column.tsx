/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";

export const adminColumns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <span
        className={
          row.original.status === "published"
            ? "text-green-600"
            : row.original.status === "draft"
            ? "text-yellow-600"
            : "text-gray-400"
        }
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }: any) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }: any) =>
      new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleEdit(row.original.id)}
      >
        Edit
      </Button>
    ),
  },
];

function handleEdit(id: string) {
  alert(`Edit problem ${id}`);
}
